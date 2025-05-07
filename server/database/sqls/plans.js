// 테이블 : plan_header

// 각 변수별로 SQL문을 등록할 떄 백틱(``)을 사용하는 이유는 줄바꿈 허용을 허용하기 떄문.
// ( 따옴표는 줄을 바꿀 경우 값이 깨지면서 에러발생 )

// 조건없이 전체조회
const selectPlanHeaderList =
`SELECT
    ph.plans_head,
    i.item_name,
    ph.plan_start,
    ph.plan_end,
    p.plans_vol,
    IFNULL(SUM(ins.plans_vol), 0) AS issued_vol,
    (p.plans_vol - IFNULL(SUM(ins.plans_vol), 0)) AS unissued_vol
FROM plan_header ph
JOIN plans p ON ph.plans_head = p.plans_head
JOIN items i ON p.item_code = i.item_code
LEFT JOIN inst ins ON p.item_code = ins.item_code
WHERE ph.plans_reg BETWEEN ? AND ?
GROUP BY ph.plans_head, i.item_name, ph.plan_start, ph.plan_end, p.plans_vol
ORDER BY ph.plans_reg DESC`;

const selectPlanDetailByHead =
`SELECT
    p.plan_no,
    i.item_name,
    so.sorder_count,
    p.plans_vol,
    so.delivery_date,
    ph.plan_start,
    ph.plan_end
FROM plans p
JOIN plan_header ph ON p.plans_head = ph.plans_head
JOIN items i ON p.item_code = i.item_code
LEFT JOIN salesorder so ON p.porder_seq = so.sorder_code
WHERE p.plans_head = ?
ORDER BY ph.plan_start DESC`;

 const updatePlanHeader = 
`UPDATE plan_header
SET plan_start = ?, plan_end = ?, plan_stat = ?, planer = ?
WHERE plans_head = ? AND plan_stat = '대기'`;

 const deletePlanHeader = 
 `DELETE FROM plan_header
  WHERE plans_head = ? 
  AND plan_stat = '대기'`;

module.exports = {
  selectPlanHeaderList,
  selectPlanDetailByHead,
  updatePlanHeader,
  deletePlanHeader,
}