module.exports = {

  // 생산 완료된 제품들의 목록을 조회
  selectFinishedProductList:
  `
    SELECT fp.item_code,
           i.item_name,
           fp.current_stock
      FROM finishedproduct AS fp
    JOIN items AS i
      ON fp.item_code = i.item_code
    ORDER BY fp.item_code
  `,

};