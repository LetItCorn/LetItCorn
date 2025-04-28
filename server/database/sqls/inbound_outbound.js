// 자재 입고/출고 처리 SQL 모음
const selectInboundList =
`SELECT
   i.min_date      AS 입고일자,
   m.mater_name    AS 자재명,
   i.min_qty       AS 수량,
   m.mater_storage AS 창고,
   i.tes_no        AS 검사번호,
   IF(i.fault_cnt>0,'O','X') AS 불량여부,
   i.min_id        AS 입고번호
FROM m_inbound i
JOIN material m ON m.mater_code = i.mater_code
ORDER BY i.min_date DESC`;

const selectOutboundList =
`SELECT
   o.mout_date     AS 출고일자,
   m.mater_name    AS 자재명,
   o.mout_qty      AS 수량,
   m.mater_storage AS 창고,
   o.mout_id       AS 출고번호
FROM m_outbound o
JOIN material m ON m.mater_code = o.mater_code
ORDER BY o.mout_date DESC`;

const insertInbound =
`INSERT INTO m_inbound
  (min_id, mater_code, min_qty, min_date, min_checker, mater_lot, tes_no, min_edate, min_stock, min_oqty)
 VALUES
  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const insertOutbound =
`INSERT INTO m_outbound
  (mout_id, mater_code, mout_qty, mout_date, mout_checker, lot_cnt, mater_lot)
 VALUES
  (?, ?, ?, ?, ?, ?, ?)`;

module.exports = {
  selectInboundList,
  selectOutboundList,
  insertInbound,
  insertOutbound
};