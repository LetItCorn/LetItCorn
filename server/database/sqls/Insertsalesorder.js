module.exports = {

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
}