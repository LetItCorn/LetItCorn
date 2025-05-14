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

// 2) 출고 등록
const insertOutbound = `
INSERT INTO m_outbound (
  mout_id, mater_code, mout_qty, mout_date, mout_checker, lot_cnt, mater_lot
) VALUES (?, ?, ?, ?, ?, ?, ?)
`;

// 단일 조회 및 삭제를 위한 SQL 추가
const selectOutboundOne = `
SELECT
  mout_id,
  mater_code,
  mout_qty,
  mout_date,
  mout_checker,
  lot_cnt,
  mater_lot
FROM m_outbound
WHERE mout_id = ?
`;

const updateMaterialStockDeduct = `
UPDATE material
   SET current_stock = current_stock - ?
 WHERE mater_code    = ?`;


const updateInboundOqty = `
UPDATE m_inbound
   SET min_oqty = min_oqty + ?
 WHERE min_id   = ?
   AND mater_code = ?`;


const deleteOutbound = `
DELETE FROM m_outbound
WHERE mout_id = ?
`;


module.exports = {
  selectOutboundList,
  insertOutbound,
  selectOutboundOne,
  deleteOutbound,
  updateMaterialStockDeduct,
  updateInboundOqty
};
