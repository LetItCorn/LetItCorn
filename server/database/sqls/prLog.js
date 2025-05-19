/// process Log sql

const getPrLog =`
SELECT p_log_no
      ,process_header
      ,log_dt
      ,item_name
      ,emp_id
      ,inst_head
      ,item_code
      ,iord_no
FROM process_log
`
const getPrLogDt = `
SELECT p_log_no 
	    ,process_code
      ,process_name
      ,lot_cnt
	    ,CONCAT(ac_cnt,spec) AS ac_cnt
      ,CONCAT(fault_cnt,spec) AS fault_cnt
      ,sta_time
      ,end_time
      ,processer
FROM pr_log_dt
WHERE p_log_no = ?
`



module.exports = {
  getPrLog,
  getPrLogDt,
}