// table = plans (생산계획 디테일)
// column plan_no, plans_head, porder_seq, item_no, plans_vol, delivery_date, item_name 
const selectPlansOne =
`SELECT plan_no,
      porder_seq,
      item_no,
      plans_vol,
      delivery_date,
      item_name
FROM plans
WHERE plans_head = ?
ORDER BY plan_no`;

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