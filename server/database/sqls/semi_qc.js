// server/database/sqls/semi_qc.js

/**
 * 반제품 품질검사 결과 INSERT
 */
const insertSemiQc = `
INSERT INTO semi_qc_inspections
  (qc_no, inst_no, qc_date, qc_result, inspector)
VALUES (?, ?, ?, ?, ?)
`;

module.exports = { insertSemiQc };
