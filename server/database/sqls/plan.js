// table = plans (생산계획 디테일)
// column plan_no, plans_head, porder_seq, item_no, plans_vol, delivery_date, item_name 
const selectPlansOne =
`SELECT 
    s.sorder_seq AS orderNumber,
    p.plans_head AS productName,
    p.item_no AS itemNo,
    i.item_name AS itemName,
    s.sorder_count AS orderQty,
    p.plans_vol AS planQty,
    p.delivery_date AS dueDate,
    h.plan_start AS planStart,
    h.plan_end AS planEnd 
FROM plans p
JOIN plan_header h ON p.plans_head = h.plans_head
JOIN salesorder s ON p.porder_seq = s.sorder_seq 
JOIN items i ON p.item_no = i.item_code
WHERE p.plans_head = ?
ORDER BY p.plan_no`;

const plansInsert =
`INSERT INTO plans (plan_no, plans_head, porder_seq, item_no, plans_vol, delivery_date, item_name)
VALUES (?, ?, ?, ?, ?, ?, ?)`;

const plansUpdate = 
`UPDATE plans
SET plans_vol = ?, delivery_date = ?, item_name = ?
WHERE plan_no = ?`;

 const plansDelete = 
`DELETE FROM plans
 WHERE plan_no = ?`;

module.exports = {
  selectPlansOne,
  plansInsert,
  plansUpdate,
  plansDelete,
}