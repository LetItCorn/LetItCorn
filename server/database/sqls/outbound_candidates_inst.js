// server/database/sqls/outbound_candidates_inst.js
//생산지시 기반 LOT 출고 후보 조회
const selectOutboundCandidatesByInstHead = `
SELECT 
  bc.mater_code,
  m.mater_name,
  bc.unit_code  AS unit,
  (bc.quantity * id.plans_vol) AS required_qty,
  i.min_id AS lot_cnt,
  i.mater_lot AS mater_lot,
  (i.min_stock - i.min_oqty) AS available_qty
  from inst_header ih
  join inst_detail id on ih.inst_head = id.inst_head
  join bom_components bc
      on id.bom_id  = bc.bom_id
      and id.item_code = bc.item_code
  join material m on m.mater_code = bc.mater_code
  join m_inbound i on i.mater_code = bc.mater_code
  where ih.inst_head = ?
    AND ih.inst_stat = 'J01'
    AND (i.min_stock - i.min_oqty) > 0
  order by bc.mater_code, i.min_date;
  `;

module.exports = {selectOutboundCandidatesByInstHead };