// server/database/sqls/materials_stock.js
const selectMaterialStock = `
SELECT
  m.mater_code,
  m.mater_name,
  m.safe_stock,
  m.current_stock             AS current_stock   
FROM material m
ORDER BY m.mater_code;
`;

const updateMaterialStock = `
  UPDATE material
    SET current_stock = current_stock + ?
    WHERE mater_code = ?
`;

module.exports = { selectMaterialStock,updateMaterialStock };
