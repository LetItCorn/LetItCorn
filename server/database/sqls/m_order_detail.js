// 발주서 상세 내역 조회
const selectMOrderDetails = `
SELECT
  moder_id,
  mater_code,
  product_name,
  spec,
  unit,
  qty,
  unit_price,
  supply_amount,
  tax_amount
FROM m_order_detail
WHERE moder_id = ?
`;

module.exports = {
  selectMOrderDetails
};
