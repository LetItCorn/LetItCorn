// server/database/sqls/qcHistory.js

// 전체 이력 조회
const selectQCHistory = `
 SELECT
   qc_no,
   moder_id,
   mater_code,
   test_field,
   test_stand,
   unit,
   qc_result,
   DATE_FORMAT(qc_date, '%Y-%m-%d') AS qc_date,
   inspector
 FROM qc_inspections
 ORDER BY qc_date DESC
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


// ── 발주서별 품질 검사 요약 ──
const selectQcOrderSummary = `
SELECT
  q.moder_id,
  h.moder_date,
  COUNT(*)                           AS total_items,
  CASE
    WHEN SUM(q.qc_result = 'FAIL') > 0 THEN 'FAIL'
    ELSE 'PASS'
  END                                 AS overall_result
FROM qc_inspections q
JOIN m_order    h  ON q.moder_id = h.moder_id
WHERE q.qc_no IN ('QC011','QC012','QC013','QC014','QC015')
GROUP BY q.moder_id, h.moder_date
ORDER BY h.moder_date DESC
`;

// 추가: 발주서별 품질 검사 이력 일괄 삭제 SQL
const deleteQcHistoryByOrder = `
DELETE FROM qc_inspections
WHERE moder_id = ?
`;


module.exports = {
  selectQCHistory,
  selectSelectedQCHistory,
  deleteQCHistory,
  selectQcOrderSummary,
  deleteQcHistoryByOrder
};
