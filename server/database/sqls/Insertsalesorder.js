module.exports = {

<<<<<<< HEAD
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
=======
  insertSalesOrder: `INSERT INTO salesorder (
    sorder_code, 
    client_code, 
    item_code, 
    delivery_date, 
    sorder_count, 
    status, 
    emp_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
>>>>>>> 59554fbb8935f69576135f3b992c06f70eafd19f

}