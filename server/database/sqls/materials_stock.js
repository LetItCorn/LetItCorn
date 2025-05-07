// server/database/sqls/materials_stock.js
// 실시간 재고 현황 조회 뷰(vw_material_stock)용 SQL
const selectMaterialStock = `
SELECT
  mater_code,
  mater_name,
  safe_stock,
  current_stock,
  diff,
  nearest_edate
FROM vw_material_stock
`;
module.exports = { selectMaterialStock };
