//table = process_log 
// join은 self입니다 쪼
//자재 입고 상태 생산지시 호출
const selectInst =
`SELECT h.inst_head, 
        lot_cnt, 
        item_code, 
        iord_no, 
        ins_stat,
        inst_no,
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
      ,f.process_header
FROM item_process_flows f JOIN processes p 
						              ON f.process_code = p.process_code
                          JOIN items i
                          ON f.item_code = i.item_code
WHERE  f.item_code = ?
ORDER BY 1
`;

// procedure out 변수 설정
const setResult = `
SET @result := "";
`

// 첫공정 저장시 공정실적 입력
const regProLog = `
CALL MKPRONO(?,?,?,?,?,?, @result);
`
// procedure out 조회
const callResult = `
SELECT @result AS p_log_no;
`
// 각 공정 결과 입력
const regProLogDt = `
INSERT INTO pr_log_dt (lot_cnt,p_log_no,sta_time,end_time,ac_cnt,fault_cnt,process_code,process_name,processer,spec,unit_code)
VALUES (?,?,STR_TO_DATE(?, '%H:%i'),STR_TO_DATE(?, '%H:%i'),?,?,?,?,?,?,?)
`

// 전체 공정 종료시 생산지시 업데이트
const setInst = `
UPDATE inst 
SET ins_stat = 'J04' , res_cnt = ?
WHERE inst_no = ?
`

// 공정에 알맞는 품질 검사 조회
const getQcTest = `
  SELECT  test_no
         ,test_feild
         ,'' AS pr_status
         ,test_stand
         ,'' AS test_res
         ,unit
  FROM test_qc
  WHERE test_target = ?
`

// 품질검사 이력 입력
const regQcLog = `
CALL INSERTQCLOG(?,?,?,?,?,?,?);
`

 module.exports = {
    selectInst,
    getFlow,
    regProLog,
    callResult,
    regProLogDt,
    setResult,
    setInst,
    getQcTest,
    regQcLog
 };