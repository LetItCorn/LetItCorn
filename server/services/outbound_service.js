/* eslint-disable camelcase */
const mariadb         = require('../database/mapper.js');
const materialService = require('./material_service.js');

/*--------------------------------------------------------------
  공통: 실제 출고 수행 (INSERT + 재고 차감)
--------------------------------------------------------------*/
async function doOutbound(conn, {
  mout_id,
  mater_code,
  mout_qty,
  mout_date,
  mout_checker,
  lot_cnt = null,
  mater_lot = null
}) {
  // 1) m_outbound INSERT
  await conn.query(
    mariadb.selectedQuery('insertOutbound', [
      mout_id,
      mater_code,
      mout_qty,
      mout_date,
      mout_checker,
      lot_cnt,
      mater_lot
    ]),
    [mout_id, mater_code, mout_qty, mout_date, mout_checker, lot_cnt, mater_lot]
  );

  // 2) material 재고 차감
  await conn.query(
    mariadb.selectedQuery('updateMaterialStockDeduct', [mout_qty, mater_code]),
    [mout_qty, mater_code]
  );
}

/*--------------------------------------------------------------
  1) 전체 출고 이력 조회
--------------------------------------------------------------*/
async function findAllOutbounds() {
  return mariadb.query('selectOutboundList');
}

/*--------------------------------------------------------------
  2) 출고 후보 조회 (생산지시 기반)
--------------------------------------------------------------*/
async function findOutboundCandidates(instHead) {
  return mariadb.query('selectOutboundCandidatesByInstHead', [instHead]);
}

/*--------------------------------------------------------------
  3) 단건 출고
--------------------------------------------------------------*/
async function addOutbound(info) {
  const { inst_head, mater_code, mout_qty } = info;

  /* ── 재고 검증 ────────────────────── */
  const mat = await materialService.findMaterialByCode(mater_code);
  if (!mat)                       return { isSuccess: false, error: '존재하지 않는 자재' };
  if (mout_qty > mat.current_stock)
    return { isSuccess: false, error: '재고 부족' };

  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();

    await doOutbound(conn, info);

    // 지시 상태 J01 → J02
    await conn.query(
      `UPDATE inst_header
         SET inst_stat = 'J02'
       WHERE inst_head = ? AND inst_stat = 'J01'`,
      [inst_head]
    );

    await conn.commit();
    return { isSuccess: true };
  } catch (err) {
    await conn.rollback();
    console.error('[Service] addOutbound ERROR', err);
    return { isSuccess: false, error: err.sqlMessage || err.message };
  } finally {
    conn.release();
  }
}

/*--------------------------------------------------------------
  4) 다건 출고 (전수 검증, 실패 시 DB 변경 없음)
--------------------------------------------------------------*/
async function addBulkOutbound(inst_head, records) {
  /* A. 사전 재고 검증 */
  const needMap = new Map(); // mater_code → 필요 총수량
  for (const r of records) {
    needMap.set(r.mater_code, (needMap.get(r.mater_code) || 0) + r.mout_qty);
  }

  const errors = [];
  for (const [code, need] of needMap) {
    const mat = await materialService.findMaterialByCode(code);
    if (!mat) {
      errors.push({ mater_code: code, isSuccess: false, error: '존재하지 않는 자재' });
    } else if (need > mat.current_stock) {
      errors.push({
        mater_code: code,
        isSuccess: false,
        error: `재고 ${mat.current_stock} < 필요 ${need}`
      });
    }
  }

  if (errors.length) {
    return { success: false, results: errors };
  }

  /* B. 트랜잭션 출고 */
  const conn = await mariadb.getConnection();
  const results = [];
  try {
    await conn.beginTransaction();

    for (const r of records) {
      await doOutbound(conn, r);
      results.push({ ...r, isSuccess: true });
    }

    // 지시 상태 J02 처리 (한 번만)
    await conn.query(
      `UPDATE inst_header
         SET inst_stat = 'J02'
       WHERE inst_head = ? AND inst_stat = 'J01'`,
      [inst_head]
    );

    await conn.commit();
    return { success: true, results };
  } catch (err) {
    await conn.rollback();
    console.error('[Service] addBulkOutbound ERROR', err);
    return { success: false, error: err.message };
  } finally {
    conn.release();
  }
}

/*--------------------------------------------------------------
  5) 출고 롤백
--------------------------------------------------------------*/
async function cancelOutbound(moutId) {
  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();

    // 기존 출고 레코드 확인
    const [row] = await conn.query(
      mariadb.selectedQuery('selectOutboundOne', [moutId]),
      [moutId]
    );
    if (!row) {
      await conn.rollback();
      return false;
    }

    // LOT 사용량 복원
    if (row.lot_cnt) {
      await conn.query(
        mariadb.selectedQuery('updateInboundOqty', [row.mout_qty, row.lot_cnt, row.mater_code]),
        [row.mout_qty, row.lot_cnt, row.mater_code]
      );
    }

    // 재고 복원
    await conn.query(
      mariadb.selectedQuery('updateMaterialStockDeduct', [-row.mout_qty, row.mater_code]),
      [-row.mout_qty, row.mater_code]
    );

    // 출고 이력 삭제
    await conn.query(
      mariadb.selectedQuery('deleteOutbound', [moutId]),
      [moutId]
    );

    await conn.commit();
    return true;
  } catch (err) {
    await conn.rollback();
    console.error('[Service] cancelOutbound ERROR', err);
    return false;
  } finally {
    conn.release();
  }
}

module.exports = {
  findAllOutbounds,
  findOutboundCandidates,
  addOutbound,
  addBulkOutbound,
  cancelOutbound
};
