// server/services/semi_qc_service.js
const mariadb        = require('../database/mapper.js');
const { insertSemiQc } = require('../database/sqls/semi_qc.js');

/**
 * 반제품 QC 결과들을 하나씩 semi_qc_inspections에 저장
 * @param {Array<{inst_no:string, qc_result:string}>} results
 * @param {string} inspector 검사자 ID
 */
async function addSemiQcResults(results, inspector) {
  // 오늘 날짜 (YYYY-MM-DD)
  const qcDate = new Date().toISOString().slice(0, 10);

  for (const r of results) {
    // 고유 QC 번호 생성: SQC + 타임스탬프 + 난수
    const qcNo =
      'SQC' +
      new Date().toISOString().replace(/\D/g, '').slice(0,14) +
      String(Math.floor(Math.random() * 10000)).padStart(4, '0');

    const params = [
      qcNo,
      r.inst_no,
      qcDate,
      r.qc_result,  // e.g. 'PASS' / 'FAIL'
      inspector
    ];
    await mariadb.query('insertSemiQc', params);
  }
}

module.exports = { addSemiQcResults };
