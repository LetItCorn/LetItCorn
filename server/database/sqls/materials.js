// server/database/sqls/materials.js

// 각 자재 관련 SQL 쿼리를 정의
const selectMaterialList = `
SELECT
  FALSE                      AS selected,
  m.mater_code               AS mater_code,
  m.mater_name               AS mater_name,
  m.mater_storage            AS category_name,
  m.safe_stock               AS safe_stock,
  m.current_stock            AS total_stock
FROM material m
ORDER BY m.mater_code
`; 

const selectMatLotList = `
SELECT
  i.mater_lot    AS 'LOT 코드',
  i.mater_code   AS '자재 코드',
  m.mater_name   AS '자재명',
  i.min_stock    AS '재고',
  i.min_date     AS '입고일자',
  i.min_edate    AS '유통기한',
  m.safe_stock   AS '안전재고',
  m.current_stock AS '현재재고'
FROM m_inbound AS i
JOIN material  AS m
  ON i.mater_code = m.mater_code
ORDER BY i.min_date
`;

const selectMaterialOne = `
SELECT *
FROM material
WHERE mater_code = ?
`;

const insertMaterial = `
INSERT INTO material (mater_code, mater_name, mater_unit, safe_stock, mater_storage, current_stock)
VALUES (?, ?, ?, ?, ?, 0)
`;

const updateMaterial = `
UPDATE material
SET ?
WHERE mater_code = ?
`;

const deleteMaterial = `
DELETE FROM material
WHERE mater_code = ?
`;

module.exports = {
  selectMaterialList,
  selectMaterialOne,
  insertMaterial,
  updateMaterial,
  deleteMaterial,
  selectMatLotList
};
