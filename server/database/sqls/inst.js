// table = inst  (생산지시 디테일)

const selectInst = 
`SELECT
  p.plan_no,
  it.item_name,
  p.plans_vol,
  i.iord_no,
  p.porder_seq,
  (IFNULL(p.plans_vol, 0) - IFNULL(i.iord_no, 0)) AS unassigned_count,
  ph.plan_end,
  ph.plan_start,
  CASE i.process_header
    WHEN 'Z01' THEN '완공정'
    WHEN 'X01' THEN '반공정'
  END AS process_header,
     i.out_od,
    ELSE NULL
  END AS out_od
FROM inst i
JOIN inst_header ih ON i.inst_head = ih.inst_head
JOIN plan_header ph ON ih.plans_head = ph.plans_head
JOIN plans p ON p.plans_head = ph.plans_head AND p.item_code = i.item_code
JOIN items it ON i.item_code = it.item_code
ORDER BY ph.plan_start DESC`;

const insertInst= 
`INSERT INTO inst (inst_no, lot_cnt, plans_vol, iord_no, process_header, inst_head, item_code, out_od, ins_stat)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

const updateInst = 
`UPDATE inst
SET lot_cnt = ?, process_header = ?, out_od = ?
WHERE inst_no = ?`;

const deleteInst = 
`DELETE FROM inst
 WHERE inst_no = ?`;

 module.exports={
  selectInst,
  insertInst,
  updateInst,
  deleteInst,
 };