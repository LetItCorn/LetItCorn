// 주문서 전체 조회
const selectSalesOrderList = 
`SELECT
  so.sorder_code    AS 주문번호,
  c.client_name     AS 거래처명,
  c.client_mgr      AS 담당자,
  i.item_name       AS 품목명,
  so.delivery_date  AS 납기일자,
  so.sorder_count   AS 주문수량,
  so.status         AS 상태,
  e.emp_id          AS 작성자
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
  so.sorder_code    AS 주문번호,
  c.client_name     AS 거래처명,
  c.client_mgr      AS 담당자,
  i.item_name       AS 품목명,
  so.delivery_date  AS 납기일자,
  so.sorder_count   AS 주문수량,
  so.status         AS 상태,
  e.emp_id          AS 작성자
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
`INSERT INTO salesorder (client_name, client_mgr, delivery_date)
VALUES (?)`;
