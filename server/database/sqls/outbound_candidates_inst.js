// server/database/sqls/outbound_candidates_inst.js
//생산지시 기반 LOT 출고 후보 조회
const selectOutboundCandidatesByInstHead = `
SELECT 
  bc.mater_code,
  m.mater_name,
  bc.unit_code     AS unit,
  (bc.quantity * id.plans_vol) AS required_qty,
  i.min_id         AS lot_cnt,
  i.mater_lot      AS mater_lot,
  (i.min_stock - i.min_oqty) AS available_qty
FROM inst_header ih
JOIN inst           id  ON ih.inst_head = id.inst_head
JOIN boms           bo  ON bo.item_code = id.item_code
JOIN bom_components bc  ON bc.bom_id     = bo.bom_id
JOIN material       m   ON m.mater_code  = bc.mater_code
JOIN m_inbound      i   ON i.mater_code  = bc.mater_code
WHERE ih.inst_head = ?
  AND ih.inst_stat = 'J01'
  AND (i.min_stock - i.min_oqty) > 0
ORDER BY bc.mater_code, i.min_date
`;

module.exports = {selectOutboundCandidatesByInstHead };