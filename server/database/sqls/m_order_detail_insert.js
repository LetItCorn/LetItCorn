// server/database/sqls/m_order_detail_insert.js
// 발주서 상세 내역 INSERT SQL
const insertMOrderDetail = `
INSERT INTO m_order_detail
  (
    moder_id,
    mater_code,
    product_name,
    spec,
    unit,
    qty,
    unit_price,
    supply_amount,
    tax_amount
  )
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

module.exports = {
  insertMOrderDetail
};



