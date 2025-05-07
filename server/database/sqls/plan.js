// table = plans (생산계획 디테일)
// column plan_no, plans_head, porder_seq, item_no, plans_vol, delivery_date, item_name 
const selectPlansOne =
`SELECT 
    s.sorder_code,
    p.plans_head,
    i.item_code,
    i.item_name,
    s.sorder_count,
    p.plans_vol,
    p.delivery_date,
    h.plan_start,
    h.plan_end 
FROM plans p
JOIN plan_header h ON p.plans_head = h.plans_head
JOIN items i ON p.item_code = i.item_code
LEFT JOIN salesorder s ON s.item_code = p.item_code
WHERE p.plans_head = ?
ORDER BY p.plan_no`;

const plansInsert =
`INSERT INTO plans (plan_no, plans_head, porder_seq, item_code, plans_vol, delivery_date, item_name)
VALUES (?, ?, ?, ?, ?, ?, ?)`;

module.exports = {
  selectPlansOne,
  plansInsert,
}