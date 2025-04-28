// 테이블 : plan_header

// 각 변수별로 SQL문을 등록할 떄 백틱(``)을 사용하는 이유는 줄바꿈 허용을 허용하기 떄문.
// ( 따옴표는 줄을 바꿀 경우 값이 깨지면서 에러발생 )

// 조건없이 전체조회
const selectPlanHeaderList =
`SELECT plans_head,
      plan_start,
      plan_end,
      plan_stat,
      plans_reg,
      planer
FROM plan_header
ORDER BY plans_reg DESC`;

const selectPlanHeaderOne =
`SELECT plans_head,
        plan_start,
        plan_end,
        plan_stat,
        planer
FROM plan_header
WHERE plans_head = ?`;

const insertPlanHeader = 
`INSERT INTO plan_header (plans_head, plan_start, plan_end, plan_stat, plans_reg, planer)
VALUES (?, ?, ?, ?, NOW(), ?)`;

 const updatePlanHeader = 
`UPDATE plan_header
 SET ?
 WHERE plans_head = ?`;

 const deletePlanHeader = 
 `DELETE FROM plan_header
  WHERE plans_head = ? 
  AND plan_stat = '대기'`;

module.exports = {
  selectPlanHeaderList,
  selectPlanHeaderOne,
  insertPlanHeader,
  updatePlanHeader,
  deletePlanHeader,
}