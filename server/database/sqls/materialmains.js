// server/database/sqls/materialmains.js

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

module.exports = {
  unitCode,
  selectMaterialMaterCode ,
  materialList,
  materialByCode,
  materialByName,
  materialSave,
  materialDelete,
};