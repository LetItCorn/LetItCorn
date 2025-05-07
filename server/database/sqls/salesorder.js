module.exports = {
  selectSalesOrderList: `SELECT
    so.sorder_code,
    c.client_name,
    c.client_mgr,
    i.item_name,
    so.delivery_date,
    so.sorder_count,
    so.status,
    e.emp_name
  FROM salesorder AS so
  JOIN client AS c
    ON so.client_code = c.client_code
  JOIN items AS i
    ON so.item_code = i.item_code
  JOIN employees AS e
    ON so.emp_id = e.emp_id
  ORDER BY so.sorder_code DESC`,

  selectSalesOrderOne: `SELECT
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
  ORDER BY so.sorder_code DESC`,

  selectSalesOrderByDeliveryDate: `SELECT
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
  ORDER BY so.delivery_date DESC`,

  // 나머지 쿼리들도 추가...

  selectSalesOrderBySorderCode: `SELECT
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
  ORDER BY so.sorder_code DESC`,

  selectSalesOrderByClientName: `SELECT
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
  ORDER BY c.client_name DESC`,

  selectSalesOrderByItemName: `SELECT
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
  ORDER BY i.item_name DESC`,

  selectSalesOrderByClientMgr: `SELECT
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
  ORDER BY c.client_mgr DESC`,

  updateSalesOrder: `UPDATE salesorder AS so
  JOIN client AS c 
    ON so.client_code = c.client_code
  JOIN items AS i
    ON so.item_code = i.item_code
  SET
    c.client_name    = ?,
    i.item_name      = ?,
    so.delivery_date = ?,
    so.sorder_count  = ?,
    so.status        = ?
  WHERE
    so.sorder_code   = ?`,

  deleteSalesOrder: `DELETE FROM salesorder
   WHERE sorder_code = ?`,

  insertSalesOrder: `INSERT INTO salesorder (sorder_code, client_name, client_mgr, item_name, sorder_count, warehouse_name, delivery_date)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,

  selectClientList: `SELECT client_code,
         client_name,
         client_mgr,
         client_type
   FROM client`,

  selectItemList: `SELECT item_code,
         item_name,
         item_type
  FROM items`,

  selectWarehouseList: `SELECT warehouse_code,
         warehouse_name,
         warehouse_type
  FROM warehouse`
};
