// server/database/sqls/defect_codes.js

// 1) 전체 조회 + 조건별 검색 (defect_code, defect_type, is_used 옵션)
const defectCodesList = `
  SELECT defect_code
       , defect_type
       , is_used
       , created_date
  FROM defect_codes
  WHERE 1=1
    AND (? = '' OR defect_code LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR defect_type LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR is_used = ?)
  ORDER BY defect_code
`;

// 1-a) 코드로만 조회
const defectCodesByCode = `
  SELECT defect_code, defect_type, is_used, created_date
  FROM defect_codes
  WHERE defect_code LIKE CONCAT('%', ?, '%')
  ORDER BY defect_code
`;

// 1-b) 유형으로만 조회
const defectCodesByType = `
  SELECT defect_code, defect_type, is_used, created_date
  FROM defect_codes
  WHERE defect_type LIKE CONCAT('%', ?, '%')
  ORDER BY defect_code
`;

// 1-c) 사용 여부로만 조회
const defectCodesByUsed = `
  SELECT defect_code, defect_type, is_used, created_date
  FROM defect_codes
  WHERE is_used = ?
  ORDER BY defect_code
`;

// 2) 단건 조회 (defect_code 기준)
const defectCodeInfo = `
  SELECT defect_code
       , defect_type
       , is_used
       , created_date
  FROM defect_codes
  WHERE defect_code = ?
`;

// 3) 등록 (INSERT)
const defectCodeInsert = `
  INSERT INTO defect_codes (defect_code, defect_type, is_used, created_date)
  VALUES (?, ?, ?, ?)
`;

// 4) 수정 (UPDATE)
const defectCodeUpdate = `
  UPDATE defect_codes
     SET defect_type  = ?
       , is_used      = ?
       , created_date = ?
   WHERE defect_code = ?
`;

// 5) 삭제 (DELETE)
const defectCodeDelete = `
  DELETE FROM defect_codes
   WHERE defect_code = ?
`;

module.exports = {
  defectCodesList,
  defectCodesByCode,
  defectCodesByType,
  defectCodesByUsed,
  defectCodeInfo,
  defectCodeInsert,
  defectCodeUpdate,
  defectCodeDelete
};
