// server/database/sqls/salesorder.js
module.exports = {
  // 주문서 전체 목록 조회
  selectSalesOrderList: 
  `SELECT
    so.sorder_code,
    c.client_name,
    c.client_mgr,
    i.item_name,
    so.delivery_date,
    so.sorder_count,
    com.code_name,
    e.emp_name
  FROM salesorder AS so
  JOIN client AS c
    ON so.client_code = c.client_code
  JOIN items AS i
    ON so.item_code = i.item_code
  JOIN employees AS e
    ON so.emp_id = e.emp_id
  JOIN common_codes AS com
    ON so.code_values = com.code_values
  ORDER BY so.sorder_code DESC`,

  // 주문서 조건 목록 조회
  selectSalesOrderOne: 
  `SELECT
    so.sorder_code,
    c.client_name,
    c.client_mgr,
    i.item_name,
    so.delivery_date,
    so.sorder_count,
    com.code_name,
    e.emp_id
  FROM salesorder AS so
  JOIN client     AS c
    ON so.client_code = c.client_code
  JOIN items      AS i
    ON so.item_code = i.item_code
  JOIN employees  AS e
    ON so.emp_id = e.emp_id
  JOIN common_codes AS com
    ON so.code_values = com.code_values
  WHERE so.sorder_code = ? or c.client_name = ? or c.client_mgr = ? or i.item_name = ? or so.sorder_count = ? or so.delivery_date = ?
  ORDER BY so.sorder_code DESC`,

  // filter 주문번호에 의한 조회
  selectSalesOrderBySorderCode: 
  `SELECT
    so.sorder_code,
    c.client_name,
    c.client_mgr,
    i.item_name,
    so.delivery_date,
    so.sorder_count,
    com.code_name,
    e.emp_id
  FROM salesorder AS so
  JOIN client     AS c
    ON so.client_code = c.client_code
  JOIN items      AS i
    ON so.item_code = i.item_code
  JOIN employees  AS e
    ON so.emp_id = e.emp_id
  JOIN common_codes AS com
    ON so.code_values = com.code_values
  ORDER BY so.sorder_code DESC`,

  // filter 납기일자에 의한 조회
  selectSalesOrderByDeliveryDate: 
  `SELECT
    so.sorder_code,
    c.client_name,
    c.client_mgr,
    i.item_name,
    so.delivery_date,
    so.sorder_count,
    com.code_name,
    e.emp_id
  FROM salesorder AS so
  JOIN client     AS c
    ON so.client_code = c.client_code
  JOIN items      AS i
    ON so.item_code = i.item_code
  JOIN employees  AS e
    ON so.emp_id = e.emp_id
  JOIN common_codes AS com
    ON so.code_values = com.code_values    
  ORDER BY so.delivery_date DESC`,

  // filter 거래처명에 의한 조회
  selectSalesOrderByClientName: 
  `SELECT
    so.sorder_code,
    c.client_name,
    c.client_mgr,
    i.item_name,
    so.delivery_date,
    so.sorder_count,
    com.code_name,
    e.emp_id
  FROM salesorder AS so
  JOIN client     AS c
    ON so.client_code = c.client_code
  JOIN items      AS i
    ON so.item_code = i.item_code
  JOIN employees  AS e
    ON so.emp_id = e.emp_id
  JOIN common_codes AS com
    ON so.code_values = com.code_values 
  ORDER BY c.client_name DESC`,

  // filter 품목명에 의한 조회
  selectSalesOrderByItemName: 
  `SELECT
    so.sorder_code,
    c.client_name,
    c.client_mgr,
    i.item_name,
    so.delivery_date,
    so.sorder_count,
    com.code_name,
    e.emp_id
  FROM salesorder AS so
  JOIN client     AS c
    ON so.client_code = c.client_code
  JOIN items      AS i
    ON so.item_code = i.item_code
  JOIN employees  AS e
    ON so.emp_id = e.emp_id
  JOIN common_codes AS com
    ON so.code_values = com.code_values 
  ORDER BY i.item_name DESC`,

  // filter 거래처 담당자에 의한 조회
  selectSalesOrderByClientMgr: 
  `SELECT
    so.sorder_code,
    c.client_name,
    c.client_mgr,
    i.item_name,
    so.delivery_date,
    so.sorder_count,
    com.code_name,
    e.emp_id
  FROM salesorder AS so
  JOIN client     AS c
    ON so.client_code = c.client_code
  JOIN items      AS i
    ON so.item_code = i.item_code
  JOIN employees  AS e
    ON so.emp_id = e.emp_id
  JOIN common_codes AS com
    ON so.code_values = com.code_values
  ORDER BY c.client_mgr DESC`,

  // 주문서 수정
  updateSalesOrder: 
  `UPDATE salesorder 
  SET
    ?
  WHERE
    sorder_code = ?`,

  // 주문서 삭제
  deleteSalesOrder: 
  `DELETE FROM salesorder
    WHERE sorder_code = ?`,

  selectClientList: 
  `SELECT client_code,
    client_name,
    client_mgr,
    client_type
    FROM client`,

  selectItemList: 
  `SELECT item_code,
    item_name,
    item_type
    FROM items`,
    
};
