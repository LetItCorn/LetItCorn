// server/database/sqls/semi_inbound.js

/**
 * 반제품 입고용 m_inbound INSERT
 *   min_id: 고유 입고 ID
 *   moder_id: inst_no (생산지시 상세 번호)
 *   mater_code: 반제품 코드
 *   min_qty: 입고 수량
 *   min_date: 입고일
 *   min_checker: 입고자(ID)
 *   mater_lot: LOT 번호 (필요 시)
 *   min_edate: 유효기간 (없으면 NULL)
 *   min_stock: 초기 재고 = min_qty
 *   min_oqty: 출고 누계 = 0
 *   test_no: QC 번호 (필요 시)
 */
const insertSemiInbound = `
INSERT INTO m_inbound
  (min_id, moder_id, mater_code, min_qty, min_date, min_checker, mater_lot, min_edate, min_stock, min_oqty, test_no)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

/**
 * material 재고 증가
 */
const increaseMaterialStock = `
UPDATE material
  SET current_stock = current_stock + ?
WHERE mater_code = ?
`;

module.exports = {
  insertSemiInbound,
  increaseMaterialStock
};
