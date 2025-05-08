// 생산 지시 작성 모달 입니다.
const selectPlanList = 
`SELECT 
  p.plan_no,
  i.item_name,
  i.spec,
  i.item_code,
  p.plans_vol,
  ph.plan_start,
  ph.plan_end,
  ph.plan_stat,
  CASE ph.plan_stat
    WHEN 'K01' THEN '대기'
    WHEN 'K02' THEN '진행중'
    WHEN 'K03' THEN '완료'
    ELSE '미지정'
  END AS plan_stat_label
FROM plans p
JOIN plan_header ph ON p.plans_head = ph.plans_head
JOIN items i ON p.item_code = i.item_code
WHERE ph.plan_stat = 'K01'
 AND (? IS NULL OR ph.plan_start >= ?)
 AND (? IS NULL OR ph.plan_end <= ?)
ORDER BY ph.plan_start DESC`;

module.exports = {
  selectPlanList,
}