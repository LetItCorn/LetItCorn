// server/services/qc_service.js
const {
  query
} = require('../database/mapper.js');
const {
  insertQC,
  selectTestQcList
} = require('../database/sqls/qcInspections.js');

// 시헝항목 전체 조회
async function findAllTestQC() {
  return await query('selectTestQcList', []);
}

// 품질검사 결과 저장
async function addQCInspections(results, inspector) {
  const qcDate = new Date().toISOString().slice(0, 10);

  for (const r of results) {
    const metas = await query('selectTestQcList', []);
    const meta = metas.find(x => x.test_no === r.qc_no) || {};
    const params = [
      r.qc_no, r.moder_id, r.mater_code, qcDate, r.qc_result, inspector,
      meta.test_field || '', meta.test_stand || '', meta.unit_name || ''
    ];
    await query('insertQC', params);
  }
}

module.exports = {
  addQCInspections,
  findAllTestQC
};