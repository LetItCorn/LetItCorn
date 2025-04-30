// server/database/sqls/processes.js

// 1) 전체조회
const selectProcessList = `
  SELECT 
    process_code,
    process_header,
    process_name,
    duration_min
  FROM processes
  ORDER BY process_code
`;

// 2) 단건조회 (코드 기준)
const selectProcessOne = `
  SELECT 
    process_code,
    process_header,
    process_name,
    duration_min
  FROM processes
  WHERE process_code = ?
`;

// 3) 이름(searchType='name') 기준 조회
const selectProcessByName = `
  SELECT 
    process_code,
    process_header,
    process_name,
    duration_min
  FROM processes
  WHERE process_name LIKE CONCAT('%', ?, '%')
  ORDER BY process_code
`;

// 4) 소요시간(searchType='duration') 기준 조회
const selectProcessByDuration = `
  SELECT 
    process_code,
    process_header,
    process_name,
    duration_min
  FROM processes
  WHERE duration_min = ?
  ORDER BY process_code
`;

// 5) 등록
const insertProcess = `
  INSERT INTO processes (
    process_code,
    process_header,
    process_name,
    duration_min
  ) VALUES (?, ?, ?, ?)
`;

// 6) 수정
const updateProcess = `
  UPDATE processes
  SET
    process_header = ?,
    process_name   = ?,
    duration_min   = ?
  WHERE process_code = ?
`;

// 7) 삭제
const deleteProcess = `
  DELETE FROM processes
  WHERE process_code = ?
`;

module.exports = {
  selectProcessList,
  selectProcessOne,
  selectProcessByName,
  selectProcessByDuration,
  insertProcess,
  updateProcess,
  deleteProcess,
};
