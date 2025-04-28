//table = process_log 
// join은 self입니다 쪼
const selectProcessLog =
 `SELECT pl.p_log_no,
       pl.log_dt,
       pl.process_head,
       pl.item_name,
       pl.emp_id,
       pl.inst_head,
       ih.inst_stat  
FROM process_log pl
JOIN inst_header ih
  ON pl.inst_head = ih.inst_head
ORDER BY pl.p_log_no;`;

const selectPrLogOne =
 `SELECT pl.p_log_no,
       pl.log_dt,
       pl.process_head,
       pl.item_name,
       pl.emp_id,
       pl.inst_head,
       ih.inst_stat  
FROM process_log pl
JOIN inst_header ih
  ON pl.inst_head = ih.inst_head
WHERE pl.p_log_no = ?`;

 const prLogInsert = 
`INSERT INTO process_log  (p_log_no, log_dt, process_head, item_name, emp_id, inst_head, item_code, iord_no)
 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
 const prLogUpdate =
 `UPDATE process_log 
 SET ?
 WHERE p_log_no = ?`;
 const prLogDelete = 
`DELETE FROM process_log 
 WHERE p_log_no = ?`;
 module.exports = {
    selectProcessLog,
    selectPrLogOne,
    prLogInsert,
    prLogUpdate,
    prLogDelete,
 };