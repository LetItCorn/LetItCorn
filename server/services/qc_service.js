// server/services/qc_service.js
const mariadb = require('../database/mapper.js');
const { insertQC } = require('../database/sqls/qcInspections.js');

/**
 * 품질 검사 결과들을 한 건씩 qc_inspections에 저장
 * @param {Array<{moder_id:string,mater_code:string,qc_result:string}>} results
 * @param {string} inspector 검사자 ID
 */
async function addQCInspections(results, inspector) {
  // 오늘 날짜 (YYYY-MM-DD)
  const now = new Date();
  const qcDate = now.toISOString().slice(0, 10);

  for (const r of results) {
    // 고유 QC 번호 생성: QC + 타임스탬프 + 난수
    const qcNo = 
      'QC' +
      new Date().toISOString().replace(/\D/g, '').slice(0,14) +
      String(Math.floor(Math.random() * 10000)).padStart(4, '0');

    const params = [
      qcNo,
      r.moder_id,
      r.mater_code,
      qcDate,
      r.qc_result,
      inspector
    ];

    await mariadb.query('insertQC', params);
  }
}

module.exports = {
  addQCInspections
};
