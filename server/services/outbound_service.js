// server/services/outbound_service.js

const mariadb = require('../database/mapper.js');
const sqlList = require('../database/sqls/mOutbound.js');
const materialService = require('./material_service.js');

/**
 * 자재 출고 서비스
 */

// 1) 전체 출고 이력 조회
async function findAllOutbounds() {
  return await mariadb.query('selectOutboundList');
}

// 2) 출고 후보 조회 (생산지시 기반)
async function findOutboundCandidates(instHead) {
  return await mariadb.query(
    'selectOutboundCandidatesByInstHead',
    [instHead]
  );
}

// 3) 단건 출고 처리
async function addOutbound(info) {
  const {
    inst_head,
    mout_id,
    mater_code,
    mout_qty,
    mout_date,
    mout_checker,
    lot_cnt,
    mater_lot
  } = info;

  // 1) 재고 검증
  const material = await materialService.findMaterialByCode(mater_code);
  if (!material) {
    return { isSuccess: false, error: '존재하지 않는 자재' };
  }
  if (mout_qty > material.current_stock) {
    return { isSuccess: false, error: '재고 부족' };
  }

  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();

    // 2) m_outbound INSERT
    await conn.query(
      sqlList.insertOutbound,
      [mout_id, mater_code, mout_qty, mout_date, mout_checker, lot_cnt, mater_lot]
    );

    // 3) material 재고 차감
    await conn.query(
      sqlList.updateMaterialStockDeduct,
      [mout_qty, mater_code]
    );

    // 4) inst_header 상태 변경 (J01 → J02)
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

// 4) 출고 롤백
async function cancelOutbound(moutId) {
  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();

    // 기존 출고 내역 조회
    const [row] = await conn.query(
      sqlList.selectOutboundOne,
      [moutId]
    );
    if (!row) {
      await conn.rollback();
      return false;
    }

    // 재고 복원
    await conn.query(
      sqlList.updateMaterialStockDeduct,
      [-row.mout_qty, row.mater_code]
    );

    // 이력 삭제
    await conn.query(
      sqlList.deleteOutbound,
      [moutId]
    );

    await conn.commit();
    return true;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// 5) 다건 출고 일괄 처리
async function addBulkOutbound(inst_head, records) {
  const conn = await mariadb.getConnection();
  const results = [];
  try {
    await conn.beginTransaction();

    for (const r of records) {
      const {
        mout_id, mater_code, mout_qty,
        mout_date, mout_checker, lot_cnt, mater_lot
      } = r;

      // 재고 검증
      const material = await materialService.findMaterialByCode(mater_code);
      if (!material) {
        results.push({ ...r, isSuccess: false, error: '존재하지 않는 자재' });
        continue;
      }
      if (mout_qty > material.current_stock) {
        results.push({ ...r, isSuccess: false, error: '재고 부족' });
        continue;
      }

      // INSERT & 차감
      await conn.query(
        sqlList.insertOutbound,
        [mout_id, mater_code, mout_qty, mout_date, mout_checker, lot_cnt, mater_lot]
      );
      await conn.query(
        sqlList.updateMaterialStockDeduct,
        [mout_qty, mater_code]
      );

      // 상태 변경 (헤더)
      await conn.query(
        `UPDATE inst_header
           SET inst_stat = 'J02'
         WHERE inst_head = ? AND inst_stat = 'J01'`,
        [inst_head]
      );

      results.push({ ...r, isSuccess: true });
    }

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

module.exports = {
  findAllOutbounds,
  findOutboundCandidates,
  addOutbound,
  cancelOutbound,
  addBulkOutbound
};
