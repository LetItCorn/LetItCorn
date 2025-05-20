module.exports = {

  // 생산 완료된 제품들의 목록을 조회
  // 임시로 J01 => 대기 원래는 J04 => 생산완료
  selectQFinishedProductList:
  `
  SELECT DISTINCT ih.inst_head,
                  i.inst_no,
                  p.plans_head,
                  i.lot_cnt,
                  i.item_code,
                  i.item_name,
                  i.iord_no,
                  ph.plan_end,
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
  WHERE i.ins_stat = 'J04'
  ORDER BY ih.inst_head, plans_head, lot_cnt
  `,
  // C01로 바뀌어야함 완제품, C02 반제품

  // 검사 항목 리스트
  InspectionFProductList:
  `
  SELECT test_no,
        test_feild,
        test_stand,
        unit_name
  FROM   test_qc
  WHERE  test_target = 'PC000'
  ORDER BY test_no
  `,
  // test_target = 'PC000'

  UpdateStat:
  `
  UPDATE inst_header
  SET inst_stat = 'C01'
  WHERE inst_head = (
    SELECT inst_head
    FROM inst
    WHERE inst_no = ?
  )
  `,

  // 지시 정보 조회
  getInstInfo:
  `
  SELECT i.item_code, i.iord_no, ih.inst_head
  FROM inst as i
  JOIN inst_header as ih
    ON i.inst_head = ih.inst_head
  WHERE i.inst_no = ?
  `,

  // 재고 업데이트
  UpdateFinishedStock:
  `
  UPDATE finishedproduct
  SET current_stock = current_stock + ?
  WHERE item_code = ?
  `,

    // 완제품 재고 조회
  selectFproductList:
  `SELECT fp.item_code,
          i.item_name,
          fp.current_stock
    FROM finishedproduct AS fp
  JOIN items AS i
    ON fp.item_code = i.item_code
  ORDER BY fp.item_code`
};