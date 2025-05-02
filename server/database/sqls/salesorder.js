// 주문서 전체 조회
const selectSalesOrderList = 
`SELECT
  so.sorder_code,
  c.client_name,
  c.client_mgr,
  i.item_name,
  so.delivery_date,
  so.sorder_count,
  so.status,
  e.emp_id
FROM salesorder AS so
JOIN client     AS c
  ON so.client_code = c.client_code
JOIN items      AS i
  ON so.item_code = i.item_code
JOIN employees  AS e
  ON so.emp_id = e.emp_id
ORDER BY so.sorder_code DESC`;

// 주문서 조건별 단건 조회
const selectSalesOrderOne =
`SELECT
  so.sorder_code,
  c.client_name,
  c.client_mgr,
  i.item_name,
  so.delivery_date,
  so.sorder_count,
  so.status,
  e.emp_id
FROM salesorder AS so
JOIN client     AS c
  ON so.client_code = c.client_code
JOIN items      AS i
  ON so.item_code = i.item_code
JOIN employees  AS e
  ON so.emp_id = e.emp_id
WHERE so.delivery_date = ? or so.sorder_code = ? or c.client_name = ? or i.item_name = ? or c.client_mgr = ?
ORDER BY so.sorder_code DESC`;

// 주문서 조회 => 납기일자로 조회
const selectSalesOrderByDeliveryDate =
`SELECT
  so.sorder_code,
  c.client_name,
  c.client_mgr,
  i.item_name,
  so.delivery_date,
  so.sorder_count,
  so.status,
  e.emp_id
FROM salesorder AS so
JOIN client     AS c
  ON so.client_code = c.client_code
JOIN items      AS i
  ON so.item_code = i.item_code
JOIN employees  AS e
  ON so.emp_id = e.emp_id
ORDER BY so.delivery_date DESC`;

// 주문서 조회 => 주문번호로 조회
const selectSalesOrderBySorderCode =
`SELECT
  so.sorder_code,
  c.client_name,
  c.client_mgr,
  i.item_name,
  so.delivery_date,
  so.sorder_count,
  so.status,
  e.emp_id
FROM salesorder AS so
JOIN client     AS c
  ON so.client_code = c.client_code
JOIN items      AS i
  ON so.item_code = i.item_code
JOIN employees  AS e
  ON so.emp_id = e.emp_id
ORDER BY so.sorder_code DESC`;

// 주문서 조회 => 거래처명 조회
const selectSalesOrderByClientName =
`SELECT
  so.sorder_code,
  c.client_name,
  c.client_mgr,
  i.item_name,
  so.delivery_date,
  so.sorder_count,
  so.status,
  e.emp_id
FROM salesorder AS so
JOIN client     AS c
  ON so.client_code = c.client_code
JOIN items      AS i
  ON so.item_code = i.item_code
JOIN employees  AS e
  ON so.emp_id = e.emp_id
ORDER BY c.client_name DESC`;

// 주문서 조회 => 품목명 조회
const selectSalesOrderByItemName =
`SELECT
  so.sorder_code,
  c.client_name,
  c.client_mgr,
  i.item_name,
  so.delivery_date,
  so.sorder_count,
  so.status,
  e.emp_id
FROM salesorder AS so
JOIN client     AS c
  ON so.client_code = c.client_code
JOIN items      AS i
  ON so.item_code = i.item_code
JOIN employees  AS e
  ON so.emp_id = e.emp_id
ORDER BY i.item_name DESC`;

// 주문서 조회 => 담당자명 조회
const selectSalesOrderByClientMgr =
`SELECT
  so.sorder_code,
  c.client_name,
  c.client_mgr,
  i.item_name,
  so.delivery_date,
  so.sorder_count,
  so.status,
  e.emp_id
FROM salesorder AS so
JOIN client     AS c
  ON so.client_code = c.client_code
JOIN items      AS i
  ON so.item_code = i.item_code
JOIN employees  AS e
  ON so.emp_id = e.emp_id
ORDER BY c.client_mgr DESC`;

// 주문서 수정
const updateSalesOrder =
`UPDATE salesorder AS so
JOIN client AS c 
  ON so.client_code = c.client_code
JOIN items AS i
  ON so.item_code = i.item_code
SET
  c.client_name    = ?,
  i.item_name      = ?,
  so.delivery_date = ?,
  so.sorder_count  = ?,
  so.status        = ?,
WHERE
  so.sorder_code   = ?`;

// 주문서 삭제
const deleteSalesOrder =
`DELETE FROM salesorder
 WHERE sorder_code = ?`;

// 주문서 등록
const insertSalesOrder =
`INSERT INTO salesorder (sorder_code, client_name, client_mgr, item_name, sorder_count, warehouse_name, delivery_date)
 VALUES (?, ?, ?, ?, ?, ?, ?)`; 

// 주문서 등록 => 거래처명, 거래처 담당자 조회
const selectClientList =
`SELECT client_code,
	      client_name,
        client_mgr,
        client_type
 FROM client`;

// 주문서 등록 => 품목명 조회
const selectItemList =
`SELECT item_code,
        item_name,
        item_type
FROM items`;

// 주문서 등록 => 출하창고 조회
const selectWarehouseList =
`SELECT warehouse_code,
        warehouse_name,
        warehouse_type
FROM warehouse`;

// 






