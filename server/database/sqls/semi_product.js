// server/database/sqls/semi_product.js

// 1) 모든 반제품 조회
const selectAllSemiProducts = `
SELECT semi_code, semi_name, spec, unit_code, current_stock, safe_stock
FROM semi_product
ORDER BY semi_code
`;

// 2) 단일 반제품 조회
const selectSemiProductByCode = `
SELECT semi_code, semi_name, spec, unit_code, current_stock, safe_stock
FROM semi_product
WHERE semi_code = ?
`;

// 3) 재고 증감
const updateSemiProductStock = `
UPDATE semi_product
SET current_stock = current_stock + ?
WHERE semi_code = ?
`;

module.exports = {
  selectAllSemiProducts,
  selectSemiProductByCode,
  updateSemiProductStock
};
