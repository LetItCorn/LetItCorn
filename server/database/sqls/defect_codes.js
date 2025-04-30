// server/database/sqls/defect_codes.js

// 1) 전체 조회
const selectDefectList = `
SELECT
  defect_code,
  defect_type,
  is_used,
  DATE_FORMAT(created_date, '%Y-%m-%d') AS created_date
FROM defect_codes
ORDER BY defect_code
`;

// 2) 단건조회 (code 기준)
const selectDefectOne = `
SELECT
  defect_code,
  defect_type,
  is_used,
  DATE_FORMAT(created_date, '%Y-%m-%d') AS created_date
FROM defect_codes
WHERE defect_code = ?
`;

// 3) 유형(searchType='type') 기준 조회
const selectDefectByType = `
SELECT
  defect_code,
  defect_type,
  is_used,
  DATE_FORMAT(created_date, '%Y-%m-%d') AS created_date
FROM defect_codes
WHERE defect_type = ?
ORDER BY defect_code
`;

// 4) 사용여부(searchType='used') 기준 조회
const selectDefectByUsed = `
SELECT
  defect_code,
  defect_type,
  is_used,
  DATE_FORMAT(created_date, '%Y-%m-%d') AS created_date
FROM defect_codes
WHERE is_used = ?
ORDER BY defect_code
`;

// 5) 등록
const insertDefect = `
INSERT INTO defect_codes (
  defect_code,
  defect_type,
  is_used,
  created_date
) VALUES (?, ?, ?, ?)
`;

// 6) 수정
const updateDefect = `
UPDATE defect_codes
SET
  defect_type = ?,
  is_used     = ?
WHERE defect_code = ?
`;

// 7) 삭제
const deleteDefect = `
DELETE FROM defect_codes
WHERE defect_code = ?
`;

module.exports = {
  selectDefectList,
  selectDefectOne,
  selectDefectByType,
  selectDefectByUsed,
  insertDefect,
  updateDefect,
  deleteDefect,
};
