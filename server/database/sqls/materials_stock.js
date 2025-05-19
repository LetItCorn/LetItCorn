// server/database/sqls/materials_stock.js
const selectMaterialStock = `
SELECT
  m.mater_code,
  m.mater_name,
  m.m_price,
  m.spec,
  m.safe_stock,
  m.current_stock             AS current_stock   
FROM material m
ORDER BY m.mater_code;
`;

// 재고 누적 sql
const updateMaterialStock = `
  UPDATE material
    SET current_stock = current_stock + ?
    WHERE mater_code = ?
`;

// 재고 차감 sql
const decreaseMaterialStock =  `
UPDATE material
  SET current_stock = current_stock - ?
  WHERE mater_code = ?
`;


module.exports = { selectMaterialStock,
                  updateMaterialStock,
                  decreaseMaterialStock };
