module.exports = {

  insertSalesOrder: `INSERT INTO salesorder (sorder_code, client_name, client_mgr, item_name, sorder_count, warehouse_name, delivery_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,

}