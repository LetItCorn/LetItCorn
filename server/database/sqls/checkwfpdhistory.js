module.exports = {

  selectProductHistory :
  `
  SELECT DISTINCT ih.inst_head,
                  p.plans_head,
                  i.lot_cnt,
                  i.item_name,
                  i.iord_no,
                  ph.plan_end,
                  DATE_FORMAT(CURRENT_DATE(), '%Y-%m-%d') AS input_date,
                  cc.code_name
  FROM inst as i
  JOIN inst_header as ih
    ON i.inst_head = ih.inst_head
  JOIN plan_header as ph
    ON ih.plans_head = ph.plans_head
  JOIN plans as p
    on ih.plans_head = p.plans_head
  JOIN common_codes as cc
    on i.ins_stat = cc.code_values
  WHERE i.ins_stat = 'J05'
  ORDER BY i.inst_head, plans_head, lot_cnt
  `

};