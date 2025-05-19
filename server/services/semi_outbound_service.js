// server/services/semi_outbound_service.js

const mariadb = require('../database/mapper.js');

/**
 * 1) 외주 대상 생산지시 목록 조회
 */
async function findAllForOutsource() {
  return await mariadb.query('selectSemiOutsourceList', []);
}

/**
 * 2) 선택된 지시(inst_no)의 BOM 자재 목록 조회
 * @param {string} instNo
 */
async function findMaterialsByInstNo(instNo) {
  return await mariadb.query('selectSemiOutboundMaterials', [instNo]);
}

/**
 * 3) 외주 자재 출고 처리
 *    - m_outbound 에 기록
 *    - semi_product.current_stock 차감
 *
 * @param {string} instNo
 * @param {string} clientCode
 * @param {Array<{mater_code:string, required_qty:number}>} records
 */
async function releaseMaterials(instNo, clientCode, records) {
  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();

    const today = new Date().toISOString().slice(0,10);

    for (const r of records) {
      const moutId = `${instNo}-${r.mater_code}-${Date.now()}`;

      // 1) m_outbound 테이블에 출고 내역 저장
      await conn.query(
        mariadb.selectedQuery('insertOutbound', [
          moutId,
          r.mater_code,
          r.required_qty,
          today,
          clientCode,
          '',    // lot_cnt (외주이므로 비워둠)
          ''     // mater_lot (외주이므로 비워둠)
        ]),
        [moutId, r.mater_code, r.required_qty, today, clientCode, '', '']
      );

      // 2) semi_product 테이블의 재고 차감
      await conn.query(
        mariadb.selectedQuery('updateSemiProductStock', [
          -r.required_qty,
          r.mater_code
        ]),
        [-r.required_qty, r.mater_code]
      );
    }

    await conn.commit();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    console.error('[Service] releaseMaterials ERROR', err);
    return { success: false, error: err.sqlMessage || err.message };
  } finally {
    conn.release();
  }
}

module.exports = {
  findAllForOutsource,
  findMaterialsByInstNo,
  releaseMaterials
};
