module.exports = {

  insertSalesOrder: 
  `INSERT INTO salesorder (
    sorder_code, 
    client_name,
    client_mgr,
    item_name, 
    delivery_date, 
    sorder_count, 
    status,
    emp_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,

}