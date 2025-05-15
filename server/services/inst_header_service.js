const db = require('../database/mapper.js');

async function findInstHeadersByStatus(stat = '대기') {
  return await db.query('selectInstHeadersByStatus', [stat]);
}


// J01(대기) 상태인 생산지시 조회
async function findOpenInstructions() {
  return await db.query('selectInstHeaderByStatus', ['J01']);
}

module.exports = { findInstHeadersByStatus,findOpenInstructions };
