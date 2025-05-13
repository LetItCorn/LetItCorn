// server/database/sqls/Insertsqt.js
module.exports = {
  // 출고량 조회
  selectShipmentQuantity: 
  `SELECT
    pdo.sout_code,
    so.sorder_code,
    ins.lot_cnt,
    i.item_name,
    so.sorder_count,
    pdo.previous_count,
    pdo.outstading_count,
    so.delivery_date
  FROM product_out AS pdo
  JOIN salesorder AS so
    ON pdo.sorder_code = so.sorder_code
  JOIN inst AS ins 
    ON pdo.item_code = ins.item_code
  JOIN items AS i
    ON pdo.item_code = i.item_code
  ORDER BY pdo.sout_code DESC`


};