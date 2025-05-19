// server/services/qc_history_service.js
const db = require('../database/mapper');

async function findAllQCHistory() {
  return await db.query('selectQCHistory', []);
}

async function findSelectedQCHistory(ids) {
  // permitSetMultiParamEntries가 true라면, db.query('selectSelectedQCHistory', [ids])로 배열 확장이 가능
  return await db.query('selectSelectedQCHistory', [ids]);
}

async function deleteQC(qc_no) {
  const res = await db.query('deleteQCHistory', [qc_no]);
  return res && res.affectedRows > 0;
}

// 발주서별 품질 검사 요약 조회
async function findAllOrderSummary() {
  return await db.query('selectQcOrderSummary', []);
}



module.exports = {
  findAllQCHistory,
  findSelectedQCHistory,
  deleteQC,
  findAllOrderSummary,
};
