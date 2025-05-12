// 자재 품질검사 결과 입력 SQL
const insertMaterialQC = `
INSERT INTO m_qc_log
  (mqc_no, tes_no, mqc_code, mqc_name, mqc_desc, mqc_date, mqc_checker, defect_qty, moder_id)
VALUES
  (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
module.exports = { insertMaterialQC };

