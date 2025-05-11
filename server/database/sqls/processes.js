// server/database/sqls/processes.js

// 1) 전체 조회 (필터 없이 모든 공정 조회)
const processList = `
  SELECT process_code
       , process_name
       , duration_min
  FROM processes
  ORDER BY process_code
`;

// 1-a) 코드로 조회 (LIKE 검색)
const processListByCode = `
  SELECT process_code
       , process_name
       , duration_min
  FROM processes
  WHERE process_code LIKE CONCAT('%', ?, '%')
  ORDER BY process_code
`;

// 1-b) 이름으로 조회 (LIKE 검색)
const processListByName = `
  SELECT process_code
       , process_name
       , duration_min
  FROM processes
  WHERE process_name LIKE CONCAT('%', ?, '%')
  ORDER BY process_code
`;

// 2) 단건 조회 (정확 일치)
const processInfo = `
  SELECT process_code
       , process_name
       , duration_min
  FROM processes
  WHERE process_code = ?
`;

// 3) 등록 (INSERT)
const processInsert = `
  INSERT INTO processes (
  process_code,
  process_name,
  duration_min
) VALUES (?, ?, ?)
ON DUPLICATE KEY UPDATE
  process_name  = VALUES(process_name),
  duration_min  = VALUES(duration_min)
`;

// 4) 수정 (UPDATE)
const processUpdate = `
  UPDATE processes
     SET 
         process_name   = ?
       , duration_min   = ?
   WHERE process_code = ?
`;

// 5) 삭제 (DELETE)
const processDelete = `
  DELETE FROM processes
   WHERE process_code = ?
`;


const selectPrecessProcessCode = `
    SELECT
  CONCAT('PC', LPAD(IFNULL(MAX(CAST(SUBSTRING(process_code, 4) AS UNSIGNED)), 0) + 1, 3, '0')) AS next_process_code
FROM processes;
`;

module.exports = {
  processList,
  processListByCode,
  processListByName,
  processInfo,
  processInsert,
  processUpdate,
  processDelete,
  selectPrecessProcessCode,
};
