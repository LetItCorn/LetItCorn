const db = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

// 조회 함수
async function findAllMaterialQC() {
  return await db.query('selectMaterialQCList')
    .catch(() => []);
}

// 검사 결과 입력
async function addMaterialQC(records) {
  console.log('[Service] addMaterialQC', records);

  const results = await Promise.all(records.map(r => {
    const data = [
      r.mqc_no, r.tes_no,
      r.mqc_code, r.mqc_name,
      r.mqc_desc, r.mqc_date,
      r.mqc_checker, r.defect_qty,
      r.moder_id
    ];
    return db.query('insertMaterialQC', data)
      .catch(err => { console.error('[Service] insertMaterialQC ERROR', err); return null; });
  })); 

  return results.every(r => r && r.affectedRows > 0);
}

module.exports = {
  findAllMaterialQC,
  addMaterialQC
};
