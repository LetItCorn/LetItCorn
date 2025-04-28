//table = pr_log_dt
const selectDetails = 
`SELECT   lot_cnt
          ,p_log_no
          ,sta_time
          ,end_time
          ,ac_cnt
          ,fault_cnt
          ,pr_log_etc
          ,process_code
          ,process_name
          ,processer
  FROM pr_log_dt
  ORDER BY lot_cnt`;

const selectDetailsOne = 
`SELECT   lot_cnt
          ,p_log_no
          ,sta_time
          ,end_time
          ,ac_cnt
          ,fault_cnt
          ,pr_log_etc
          ,process_code
          ,process_name
          ,processer
  FROM pr_log_dt
  WHERE process_name = ?`;

const detailsInsert = 
`INSERT INTO pr_log_dt (lot_cnt, p_log_no, sta_time, end_time, ac_cnt, fault_cnt, pr_log_etc, process_code, process_name, processer)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const detailsUpdate =
`UPDATE pr_log_dt
SET ?
WHERE lot_cnt = ?`;

const detailsDelete = 
`DELETE FROM pr_log_dt
WHERE lot_cnt= ?`;

module.exports = {
  selectDetails,
  selectDetailsOne,
  detailsInsert,
  detailsUpdate,
  detailsDelete,
}