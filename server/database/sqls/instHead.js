//table=  inst_head (생산지시헤더)
const selectInstHeadList = 
`SELECT
  ih.inst_head,
  i.inst_no,
  p.plan_no,
  it.item_name,
  i.plans_vol,
  i.iord_no,
  ph.plan_start, 
  ph.plan_end, 
  i.process_header, 
  i.out_od, 
  ih.inster, 
  i.ins_stat 
FROM inst_header ih
JOIN inst i ON ih.inst_head = i.inst_head
JOIN plan_header ph ON ih.plans_head = ph.plans_head
JOIN plans p ON p.plans_head = ph.plans_head
             AND p.item_code = i.item_code
JOIN items it ON i.item_code = it.item_code
WHERE ph.plan_start BETWEEN ? AND ?
ORDER BY ih.inst_head DESC`;

const selectInstHeaderById=
 `SELECT
  ih.inst_head,
  i.inst_no,
  p.plan_no,
  it.item_name,
  i.plans_vol,
  i.iord_no,
  ph.plan_start,
  ph.plan_end,
  i.process_header,
  i.out_od,
  ih.inster,
  i.inst_stat
FROM inst_header ih
JOIN inst i ON ih.inst_head = i.inst_head
JOIN plans p ON i.plan_no = p.plan_no
JOIN item it ON i.item_code = it.item_code
JOIN plan_header ph ON p.plans_head = ph.plans_head
WHERE ih.inst_head = ?`;

const insertInstHeader= 
`INSERT INTO inst_header (inst_head, inst_start, inst_stat, plans_head, inster)
 VALUES (?, ?, ?, ?, ?)`;

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
  insertInstHeader,
  updateInstHead,
  deleteInstHead,
};