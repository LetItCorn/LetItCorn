// server/services/semi_inbound_service.js

const mariadb = require('../database/mapper.js');

/**
 * 반제품 입고 처리
 *  - m_inbound 에 기록
 *  - semi_product.current_stock 증가
 *
 * @param {string} instNo      반제품 생산지시 상세 번호
 * @param {string} materCode   반제품 코드
 * @param {number} qty         입고 수량
 * @param {string} checker     입고자 ID
 */
async function processSemiInbound(instNo, materCode, qty, checker) {
  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();

    const today = new Date().toISOString().slice(0, 10);
    const minId = `SIN${instNo}-${Date.now()}`;

    // 1) m_inbound 테이블에 입고 내역 저장
    await conn.query(
      mariadb.selectedQuery('insertSemiInbound', [
        minId,
        instNo,
        materCode,
        qty,
        today,
        checker,
        '',     // mater_lot
        null,   // min_edate
        qty,    // min_stock
        0,      // min_oqty
        null    // test_no
      ]),
      [minId, instNo, materCode, qty, today, checker, '', null, qty, 0, null]
    );

    // 2) semi_product 테이블의 재고 증가
    await conn.query(
      mariadb.selectedQuery('updateSemiProductStock', [qty, materCode]),
      [qty, materCode]
    );

    await conn.commit();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    console.error('[Service] processSemiInbound ERROR', err);
    return { success: false, error: err.sqlMessage || err.message };
  } finally {
    conn.release();
  }
}

module.exports = {
  processSemiInbound
};
