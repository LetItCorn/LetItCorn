// 발주서(Purchase Order) SQL 쿼리 정의
const selectPurchaseOrderList = 
`SELECT
   porder_code   AS 발주번호
  ,client_code   AS 거래처번호
  ,item_code     AS 품목코드
  ,delivery_date AS 납기일자
  ,porder_count  AS 수량
  ,manager       AS 담당자
  ,status        AS 상태
FROM purchaseorder
ORDER BY porder_code`;

const selectPurchaseOrderOne = 
`SELECT
   porder_code, client_code, item_code, delivery_date,
   porder_count, manager, status
 FROM purchaseorder
 WHERE porder_code = ?`;

const insertPurchaseOrder = 
`INSERT INTO purchaseorder
  (porder_code, client_code, item_code, delivery_date, porder_count, manager, status)
 VALUES
  (?, ?, ?, ?, ?, ?, ?)`;

const updatePurchaseOrder = 
`UPDATE purchaseorder
 SET ?
 WHERE porder_code = ?`;

const deletePurchaseOrder = 
`DELETE FROM purchaseorder
 WHERE porder_code = ?`;

module.exports = {
  selectPurchaseOrderList,
  selectPurchaseOrderOne,
  insertPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder
};