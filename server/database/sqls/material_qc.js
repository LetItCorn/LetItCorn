// 자재 품질검사 리스트 조회 SQL
const selectMaterialQCList = `
SELECT
  tq.test_no            AS 품질검사ID,
  mq.mqc_code           AS 결과코드,
  mq.mqc_name           AS 결과명,
  mq.mqc_desc           AS 사유,
  mq.mqc_date           AS 검사일자,
  mq.mqc_checker        AS 검사자,
  mq.defect_qty         AS 불량수
FROM m_qc_log mq
JOIN test_qc tq
  ON mq.tes_no = tq.test_no
ORDER BY mq.mqc_date DESC
`;
module.exports = { selectMaterialQCList };