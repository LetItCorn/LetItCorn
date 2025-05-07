// server/database/sqls/mOutboundPicking.js

/**
 * 피킹 리스트용 출고 상세 조회
 * :ids 는 콤마로 구분된 mout_id 문자열입니다.
 */
const selectOutboundPickingList = `
SELECT
  o.mout_id,
  o.mater_code,
  m.mater_name,
  o.mout_qty,
  o.lot_cnt,
  o.mater_lot,
  o.mout_date,
  o.mout_checker
FROM m_outbound o
JOIN material m ON m.mater_code = o.mater_code
WHERE o.mout_id IN (:ids)
ORDER BY o.mout_date, o.mout_id
`;

module.exports = { selectOutboundPickingList };
