// table = inst  (생산지시 디테일)

const selectInst = 
`SELECT   inst_no
          ,lot_cnt
          ,plans_vol
          ,iord_no
          ,process_head
          ,inst_head
          ,item_code
          ,out_od
FROM inst
ORDER BY inst_no`;

const selectInstOne = 
`SELECT   inst_no
          ,lot_cnt
          ,plans_vol
          ,iord_no
          ,process_head
          ,inst_head
          ,item_code
          ,out_od
FROM inst
WHERE inst_no = ?`;

const insertInst= 
`INSERT INTO inst (inst_no, lot_cnt, plans_vol, iord_no, process_header, inst_head, item_code, out_od)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

const updateInst = 
`UPDATE inst
SET ?
WHERE inst_no = ?`;

const deleteInst = 
`DELETE FROM inst
 WHERE inst_no = ?`;

 module.exports={
  selectInst,
  selectInstOne,
  insertInst,
  updateInst,
  deleteInst,
 };