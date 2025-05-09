// server/database/sqls/outbound_candidates.js

// 입고 LOT 중 아직 출고 가능 수량이 남은 것들만 조회
const selectOutboundCandidates = `
SELECT
  i.min_id    AS lot_cnt,
  i.mater_code,
  m.mater_name,
  (i.min_stock - i.min_oqty) AS total_stock,
  i.mater_lot
FROM m_inbound i
JOIN material  m ON m.mater_code = i.mater_code
WHERE (i.min_stock - i.min_oqty) > 0
ORDER BY i.min_date
`;

module.exports = { selectOutboundCandidates };
