module.exports = {

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