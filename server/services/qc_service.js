// server/services/qc_service.js
const {query} = require('../database/mapper.js');
const { insertQC,selectTestQcList } = require('../database/sqls/qcInspections.js');

// 시헝항목 전체 조회
async function findAllTestQC() {
  return await query('selectTestQcList', []);
}

// 품질검사 결과 저장
async function addQCInspections(results, inspector) {
  const qcDate = new Date().toISOString().slice(0, 10);

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
    await query('insertQC', params);
  }
}

module.exports = {
  addQCInspections,
  findAllTestQC
};
