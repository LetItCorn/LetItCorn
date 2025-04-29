// 각 자재 관련 SQL 쿼리를 정의
const selectMaterialList = 
`SELECT
  FALSE              AS 선택
  ,m.mater_code       AS 자재코드
  ,m.mater_name       AS 자재명
  ,m.mater_storage    AS 자재구분
  ,m.safe_stock       AS 안전재고
  ,COALESCE(si.total_in,0) - COALESCE(so.total_out,0) AS 전체재고
FROM material m
ORDER BY m.mater_code`;

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