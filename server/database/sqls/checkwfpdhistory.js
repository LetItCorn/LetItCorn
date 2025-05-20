module.exports = {

  selectProductHistory :
  `
  SELECT DISTINCT i.inst_head,
                  p.plans_head,
                  i.lot_cnt,
                  i.item_name,
                  i.iord_no,
                  ph.plan_end,
                  DATE_FORMAT(CURRENT_DATE(), '%Y-%m-%d') AS input_date,
                  cc.code_name
  FROM inst_header as ih
  JOIN plan_header as ph
    ON ih.plans_head = ph.plans_head
  JOIN inst as i
    ON ih.inst_head = i.inst_head
  JOIN plans as p
    on ih.plans_head = p.plans_head
  JOIN common_codes as cc
    on ih.inst_stat = cc.code_values
  WHERE ih.inst_stat = 'C01'
  ORDER BY i.inst_head, plans_head, lot_cnt
  `

};