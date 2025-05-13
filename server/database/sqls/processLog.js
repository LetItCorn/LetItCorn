//table = process_log 
// join은 self입니다 쪼
//자재 입고 상태 생산지시 호출
const selectInst =
`SELECT h.inst_head, 
        lot_cnt, 
        item_code, 
        iord_no, 
        ins_stat,
        '대기' as state,
        '' as cur_cnt        
  FROM inst_header h JOIN inst i
                      ON  h.inst_head = i.inst_head
  WHERE inst_stat = 'J02'
  AND out_od = 'Y'`
;

// 선택한 품목의 공정흐름도 호출
const getFlow = `
SELECT f.sequence_order
      ,f.item_code
      ,i.item_name
      ,f.process_code
      ,p.duration_min
      ,p.process_name 
      ,'' as sta_time
      ,'' as end_time
      ,'' as ac_cnt
      ,'' as fault_cnt
      ,'대기' as pr_status
      ,p.spec
      ,p.unit_code
FROM item_process_flows f JOIN processes p 
						              ON f.process_code = p.process_code
                          JOIN items i
                          ON f.item_code = i.item_code
WHERE  f.item_code = ?
ORDER BY 1
`;

// 첫공정 저장시 공정실적 입력
const regProLog = `
INSERT INTO process_log (p_log_no,log_dt,process_header,item_name,emp_id,item_code,iord_no,inst_no)
VALUES (?,?,?,?,?,?,?,?)
`

// 각 공정 결과 입력
const regProLogDt = `
INSERT INTO pr_lot_dt (lot_cnt,pr_log_no,sta_time,end_time,zc_cnt_fault_cnt,process_code,process_name,processer_spec_unit_code)
VALUES (?,?,?,?,?,?,?,?,?,?,?)
`

// 전체 공정 종료시 생산지시 업데이트
const setInst = `
UPDATE inst 
SET inst_stat = 'J04' , res_cnt = ?
WHERE lot_cnt = ?
`

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
    selectInst,
    getFlow
 };