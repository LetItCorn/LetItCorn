// 테이블 : plan_header

// 각 변수별로 SQL문을 등록할 떄 백틱(``)을 사용하는 이유는 줄바꿈 허용을 허용하기 떄문.
// ( 따옴표는 줄을 바꿀 경우 값이 깨지면서 에러발생 )

// 조건없이 전체조회
const selectPlanHeaderList =
`SELECT plans_head
		    , plan_start
        , plan_end
        , plan_stat
        , plans_reg
        , planer         
FROM plan_header
ORDER BY plans_head`;

const selectPlanHeaderOne =
`SELECT plans_head
		    , plan_start
        , plan_end
        , plan_stat
        , plans_reg
        , planer         
FROM plan_header
WHERE plans_head = ?`;



 const planDelete = 
`DELETE FROM plan_header
 WHERE plans_head = ?`;
module.exports = {
  selectPlanHeaderList,
  selectPlanHeaderOne,
  planDelete,

}