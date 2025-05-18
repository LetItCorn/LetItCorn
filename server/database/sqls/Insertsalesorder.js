// server/database/sqls/Insertsalesorder.js
module.exports = {
  // 주문서 등록
  insertSalesOrder: 
  `INSERT INTO salesorder (
    sorder_code, 
    client_code,
    item_code, 
    delivery_date, 
    sorder_count,
    code_values,
    emp_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?)`,

  // 거래처 목록 조회
  selectClientList: 
  `SELECT c.client_code,
    c.client_name,
    c.client_mgr,
    com.code_name
  FROM client as c
  JOIN common_codes as com
    ON c.code_values = com.code_values
  WHERE com.code_values = 'E02'
  ORDER BY c.client_code`,

  // 품목 목록 조회
  selectItemList: 
  `SELECT item_code,
    item_name,
    item_type
  FROM items`,

  generateSalesOrderCode :
  `CALL GENSALESORDERCODE(@result);
  SELECT @result AS sorder_code`,


}