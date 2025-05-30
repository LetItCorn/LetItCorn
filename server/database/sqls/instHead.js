//table=  inst_head (생산지시헤더)
const selectInstHeadList = 
`SELECT
  ih.inst_head,
  i.inst_no,
  i.lot_cnt,
  p.plan_no,
  i.item_name,
  i.plans_vol,
  i.iord_no,
  ph.plan_start,
  ph.plan_end,
  i.process_header,
  i.out_od,
  ih.inster,
  i.ins_stat,
  CASE i.ins_stat
    WHEN 'J01' THEN '대기'
    WHEN 'J02' THEN '자재입고'
    WHEN 'J03' THEN '생산중'
    ELSE '생산종료'
  END AS ins_stat_label
FROM inst_header ih
JOIN inst i ON ih.inst_head = i.inst_head
LEFT JOIN plan_header ph ON ih.plans_head = ph.plans_head
LEFT JOIN plans p ON p.plans_head = ph.plans_head AND p.item_code = i.item_code
WHERE DATE(ph.plan_start) BETWEEN ? AND ?
ORDER BY ih.inst_head DESC`;

const selectInstHeaderById=
 `SELECT
  ih.inst_head,
  i.inst_no,
  i.lot_cnt,
  IFNULL(p.plan_no, '') AS plan_no,
  i.item_name,
  i.plans_vol,
  i.iord_no,
  ph.plan_start,
  ph.plan_end,
  i.process_header,
  CASE i.process_header
    WHEN 'X01' THEN '반공정'
    WHEN 'Z01' THEN '완공정'
    ELSE '잘못된지시'
  END AS process_header_label,
  i.out_od,
  ih.inster,
  i.ins_stat
FROM inst i
JOIN inst_header ih ON i.inst_head = ih.inst_head
LEFT JOIN plan_header ph ON ih.plans_head = ph.plans_head
LEFT JOIN plans p ON p.plans_head = ph.plans_head AND p.item_code = i.item_code
WHERE ih.inst_head = (SELECT inst_head FROM inst WHERE inst_no = ?)
ORDER BY i.inst_no`;

const updateInstHead=
`UPDATE inst_head
SET iord_no = ?, process_header = ?, out_od = ?, plans_vol = ? 
WHERE inst_no = ?  AND inst_stat = 'J01'`;

const deleteInstHead=
`DELETE FROM inst_header
WHERE inst_head = ? AND inst_stat = 'J01'`;

module.exports = {
  selectInstHeadList,
  selectInstHeaderById,
  updateInstHead,
  deleteInstHead,
};