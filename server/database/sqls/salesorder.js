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
  ON so.item_code   = i.item_code
JOIN employees AS e
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
  ON so.item_code   = i.item_code
JOIN employees AS e
  ON so.emp_id = e.emp_id
WHERE so.delivery_date = ? or so.sorder_code = ? or c.client_name = ? or i.item_name = ? or c.client_mgr = ?
ORDER BY so.sorder_code DESC`;

// 주문서 수정
const updateSalesOrder =
`UPDATE salesorder AS so
JOIN client AS c 
  ON so.client_code = c.client_code
JOIN items AS i
  ON so.item_code = i.item_code
SET
  c.cient_name     = ?,
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
`INSERT INTO salesorder (c.client_name, c.client_mgr, delivery_date)
SELECT c.client_name, c.client_mgr
FROM client AS c
WHERE c.client_code = ?
VALUES (?)`;
