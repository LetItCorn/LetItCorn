// server/database/sqls/materials.js

// 공통코드 조회 정의
const unitCode =`
    SELECT code_name, code_values
    FROM common_codes
    WHERE code_group = 'UU'
`;

/* 가장 큰 코드 끝 3자리 + 1 → ‘MAT001’ 형식으로 리턴 */
const selectMaterialMaterCode = `
  SELECT CONCAT(
           'MAT',
           LPAD(
             IFNULL(MAX(CAST(SUBSTRING(mater_code, 4) AS UNSIGNED)), 0) + 1,
             3,'0'
           )
         ) AS next_mater_code
  FROM material;
`;

// 1) 전체 조회 + 조건별 검색 (mater_code, mater_name 모두 옵션)
    // 자재 전체 목록 조회
    // - 필터 조건(mater_code, mater_name)이 비어 있으면 전체 조회
const materialList = `
    SELECT 
      mater_code,
      mater_name,
      safe_stock,
      current_stock,
      m_price,
      spec,
      unit_code
    FROM material
    WHERE 1=1
      AND (? = '' OR mater_code LIKE CONCAT('%', ?, '%'))
      AND (? = '' OR mater_name LIKE CONCAT('%', ?, '%'))
    ORDER BY mater_code
`;

// 2) 단건 조회 (mater_code 기준)
// 단건 조회: mater_code에 해당하는 자재 한 건 조회
const materialByCode = `
    SELECT 
      mater_code,
      mater_name,
      safe_stock,
      current_stock,
      m_price,
      spec,
      unit_code
    FROM material
    WHERE mater_code = ?
`;

// 3) 단건 조회 (mater_name 기준)
const materialByName = `
    SELECT 
      mater_code,
      mater_name,
      safe_stock,
      current_stock,
      m_price,
      spec,
      unit_code
    FROM material
    WHERE mater_name LIKE CONCAT('%', ?, '%')
`;

// 4) 등록/수정 MERGE (ON DUPLICATE KEY UPDATE)
    // 자재 등록 또는 수정
    // - INSERT 실패(기존 PK 충돌) 시 UPDATE 수행
const materialSave = `
    INSERT INTO material (
    mater_code,
    mater_name,
    safe_stock,
    current_stock,
    m_price,
    spec,
    unit_code
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    mater_name     = VALUES(mater_name),
    safe_stock     = VALUES(safe_stock),
    current_stock  = VALUES(current_stock),
    m_price        = VALUES(m_price),
    spec           = VALUES(spec),
    unit_code      = VALUES(unit_code)
`;

// 5) 삭제 (mater_code 기준)
    // 자재 삭제: mater_code에 해당하는 자재 삭제
const materialDelete = `
    DELETE FROM material
    WHERE mater_code = ?
`;

// =======================================================================

// 각 자재 관련 SQL 쿼리를 정의
const selectMaterialList = `
SELECT
  FALSE                      AS selected,
  m.mater_code               AS mater_code,
  m.mater_name               AS mater_name,
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
INSERT INTO material (mater_code, mater_name, mater_unit, safe_stock, current_stock)
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
  unitCode,
  selectMaterialMaterCode ,
  materialList,
  materialByCode,
  materialByName,
  materialSave,
  materialDelete,

  selectMaterialList,
  selectMaterialOne,
  insertMaterial,
  updateMaterial,
  deleteMaterial,
  selectMatLotList
};
