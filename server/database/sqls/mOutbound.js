// server/database/sqls/mOutbound.js

// 1) 전체 출고 이력 조회
const selectOutboundList = `
SELECT
  mout_id,
  mater_code,
  mout_qty,
  DATE_FORMAT(mout_date, '%Y-%m-%d') AS mout_date,
  mout_checker,
  lot_cnt,
  mater_lot
FROM m_outbound
ORDER BY mout_date DESC, mout_id
`;

// 2) 출고 등록 (lot_cnt, mater_lot 포함)
const insertOutbound = `
INSERT INTO m_outbound (
  mout_id,
  mater_code,
  mout_qty,
  mout_date,
  mout_checker,
  lot_cnt,
  mater_lot
) VALUES (?, ?, ?, ?, ?, ?, ?)
`;

// 3) 단건 조회
const selectOutboundOne = `
SELECT
  mout_id,
  mater_code,
  mout_qty,
  lot_cnt,
  mater_lot
FROM m_outbound
WHERE mout_id = ?
`;

// 4) 출고 이력 삭제
const deleteOutbound = `
DELETE FROM m_outbound
WHERE mout_id = ?
`;

// 5) 재고 차감
const updateMaterialStockDeduct = `
UPDATE material
   SET current_stock = current_stock - ?
 WHERE mater_code    = ?
`;

module.exports = {
  selectOutboundList,
  insertOutbound,
  selectOutboundOne,
  deleteOutbound,
  updateMaterialStockDeduct
};
