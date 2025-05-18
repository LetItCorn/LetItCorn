// server/database/sqls/qcInspections.js
const insertQC = `
INSERT INTO qc_inspections 
  (qc_no, moder_id, mater_code, qc_date, qc_result, inspector, test_field, test_stand, unit)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

// 품질검사 항목 전체 조회
const selectTestQcList = `
SELECT
  test_no,
  test_feild    AS test_field,
  test_stand,
  unit
FROM test_qc
ORDER BY test_no
`;


module.exports = {
  insertQC,
  selectTestQcList
};
