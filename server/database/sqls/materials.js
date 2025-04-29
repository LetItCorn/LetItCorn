// 각 자재 관련 SQL 쿼리를 정의
const selectMaterialList = `
SELECT
  FALSE                             AS selected,
  m.mater_code                      AS mater_code,
  m.mater_name                      AS mater_name,
  m.mater_storage                   AS category_name,
  m.safe_stock                      AS safe_stock,
  COALESCE(
    (SELECT SUM(min_qty)     FROM m_inbound  WHERE mater_code = m.mater_code),
    0
  )
  -
  COALESCE(
    (SELECT SUM(mout_qty)    FROM m_outbound WHERE mater_code = m.mater_code),
    0
  )                                  AS total_stock
FROM material m
ORDER BY m.mater_code
`; 

const selectMaterialOne = 
`SELECT *
  FROM material
  WHERE mater_code = ?`;

const insertMaterial = 
`INSERT INTO material (mater_code, mater_name, mater_unit, safe_stock, mater_storage)
  VALUES (?, ?, ?, ?, ?)`;

const updateMaterial = 
`UPDATE material
  SET ?
  WHERE mater_code = ?`;

const deleteMaterial = 
`DELETE FROM material
  WHERE mater_code = ?`;

module.exports = {
  selectMaterialList,
  selectMaterialOne,
  insertMaterial,
  updateMaterial,
  deleteMaterial
};