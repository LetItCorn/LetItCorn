// server/database/sqls/defect_codes.js

// 1) 전체 조회 + 조건별 검색 (defect_code, defect_type, is_used 옵션)
const defectCodesList = `
  SELECT defect_code
       , defect_type
       , is_used
      , DATE_FORMAT( created_date , '%Y-%m-%d') AS created_date
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
    INSERT INTO defect_codes (
    defect_code,
    defect_type,
    is_used,
    created_date
  ) VALUES (?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    defect_type   = VALUES(defect_type),
    is_used       = VALUES(is_used),
    created_date  = VALUES(created_date);
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


const selectdefectCode = `
    SELECT
  CONCAT(
    'DC',
    DATE_FORMAT(CURDATE(), '%y%m%d'),
    LPAD(
      IFNULL(
        MAX(CAST(SUBSTRING(defect_code, 9, 3) AS UNSIGNED)),
        0
      ) + 1,
      3,
      '0'
    )
  ) AS next_defect_code
FROM defect_codes;
`;


module.exports = {
  defectCodesList,
  defectCodesByCode,
  defectCodesByType,
  defectCodesByUsed,
  defectCodeInfo,
  defectCodeInsert,
  defectCodeUpdate,
  defectCodeDelete,
  selectdefectCode
};
