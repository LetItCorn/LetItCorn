// server/database/sqls/processes.js

// 공통코드 가져오기
const unitCode = `
  SELECT code_name, code_values
  FROM common_codes
  WHERE code_group = 'UU'
`;

// 1) 전체 조회
const processList = `
  SELECT process_code
       , process_name
       , duration_min
       , unit_code
       , spec
  FROM processes
  ORDER BY process_code
`;

// 1-a) 코드로 조회 (LIKE)
const processListByCode = `
  SELECT process_code
       , process_name
       , duration_min
       , unit_code
       , spec
  FROM processes
  WHERE process_code LIKE CONCAT('%', ?, '%')
  ORDER BY process_code
`;

// 1-b) 이름으로 조회 (LIKE)
const processListByName = `
  SELECT process_code
       , process_name
       , duration_min
       , unit_code
       , spec
  FROM processes
  WHERE process_name LIKE CONCAT('%', ?, '%')
  ORDER BY process_code
`;

// 2) 단건 조회
const processInfo = `
  SELECT process_code
       , process_name
       , duration_min
       , unit_code
       , spec
  FROM processes
  WHERE process_code = ?
`;

// 3) 등록 (MERGE)
const processInsert = `
  INSERT INTO processes (
    process_code,
    process_name,
    duration_min,
    unit_code,
    spec
  ) VALUES (?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    process_name  = VALUES(process_name),
    duration_min  = VALUES(duration_min),
    unit_code     = VALUES(unit_code),
    spec          = VALUES(spec)
`;

// 4) 수정
const processUpdate = `
  UPDATE processes
     SET process_name  = ?
       , duration_min  = ?
       , unit_code     = ?
       , spec          = ?
   WHERE process_code = ?
`;

// 5) 삭제
const processDelete = `
  DELETE FROM processes
  WHERE process_code = ?
`;

// 6) 공정 코드 자동 생성
const selectPrecessProcessCode = `
  SELECT CONCAT('PC', LPAD(
    IFNULL(MAX(CAST(SUBSTRING(process_code, 3) AS UNSIGNED)), 0) + 1,
    3,
    '0')) AS next_process_code
  FROM processes
`;

module.exports = {
  unitCode,
  processList,
  processListByCode,
  processListByName,
  processInfo,
  processInsert,
  processUpdate,
  processDelete,
  selectPrecessProcessCode,
};
