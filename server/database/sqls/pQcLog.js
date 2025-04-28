//table = p_qc_log
const selectQcLog =
`SELECT   pqc_no
          ,process_code
          ,item_code
          ,emp_id
          ,qc_stat
          ,qc_etc
          ,qc_dt
          ,lot_cnt
FROM p_qc_log
ORDER BY pqc_no`;
const selectQcLogOne =
`SELECT   pqc_no
          ,process_code
          ,item_code
          ,emp_id
          ,qc_stat
          ,qc_etc
          ,qc_dt
          ,lot_cnt
FROM p_qc_log
WHERE pqc_no = ?`;

const QcLogInsert = 
`INSERT INTO p_qc_log (process_code, item_code, emp_id, qc_stat, qc_etc, qc_dt, lot_cnt)
VALUES (?, ?, ?, ?, ?, ?, ?)`;
const QcLogUpdate =
`UPDATE p_qc_log
SET ?
WHERE pqc_no = ?`;
const QcLogDelete =
`DELETE FROM p_qc_log
WHERE pqc_no= ?`;

module.exports={
  selectQcLog,
  selectQcLogOne,
  QcLogInsert,
  QcLogUpdate,
  QcLogDelete,
}