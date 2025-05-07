// server/database/sqls/qcInspections.js
const insertQC = `
INSERT INTO qc_inspections 
  (qc_no, moder_id, mater_code, qc_date, qc_result, inspector)
VALUES (?, ?, ?, ?, ?, ?)
`;

module.exports = {
  insertQC
};
