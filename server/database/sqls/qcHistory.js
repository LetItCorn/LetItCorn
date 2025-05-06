// server/database/sqls/qcHistory.js

// 전체 이력 조회
const selectQCHistory = `
SELECT
  q.qc_no,
  q.moder_id,
  q.mater_code,
  m.mater_name,
  DATE_FORMAT(q.qc_date, '%Y-%m-%d') AS qc_date,
  q.qc_result,
  q.inspector
FROM qc_inspections q
JOIN material m
  ON q.mater_code = m.mater_code
ORDER BY q.qc_date DESC
`;

// 선택 이력 조회 (qc_no 목록)
const selectSelectedQCHistory = `
SELECT
  q.qc_no,
  q.moder_id,
  q.mater_code,
  m.mater_name,
  DATE_FORMAT(q.qc_date, '%Y-%m-%d') AS qc_date,
  q.qc_result,
  q.inspector
FROM qc_inspections q
JOIN material m
  ON q.mater_code = m.mater_code
WHERE q.qc_no IN (?)
ORDER BY q.qc_date DESC
`;

// 단건 삭제
const deleteQCHistory = `
DELETE FROM qc_inspections
WHERE qc_no = ?
`;

module.exports = {
  selectQCHistory,
  selectSelectedQCHistory,
  deleteQCHistory
};
