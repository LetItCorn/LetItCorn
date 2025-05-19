module.exports = {

  // 생산 완료된 제품들의 목록을 조회
  // 임시로 J01 => 대기 원래는 J04 => 생산완료
  selectQFinishedProductList:
  `
  SELECT DISTINCT i.inst_head,
                  p.plans_head,
                  i.lot_cnt,
                  i.item_name,
                  i.iord_no,
                  ph.plan_end,
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
  WHERE ih.inst_stat = 'J04'
  ORDER BY i.inst_head
  `,

  // 검사 항목 리스트
  InspectionFProductList:
  `
  SELECT test_no,
        test_feild,
        test_stand,
        unit
  FROM   test_qc
  WHERE  (test_no = 'QC016' or test_no = 'QC017' or test_no = 'QC018')
  ORDER BY test_no
  `
};