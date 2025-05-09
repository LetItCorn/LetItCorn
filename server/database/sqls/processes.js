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
    process_code
  , process_name
  , duration_min
  ) VALUES (?, ?, ?, ?)
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

module.exports = {
  processList,
  processListByCode,
  processListByName,
  processInfo,
  processInsert,
  processUpdate,
  processDelete,
};
