/* instructions_service.js */
const db = require('../database/mapper.js');

async function findOpenInstructions() {
  // 별칭은 새 SQL 파일에서 export 한 이름과 동일
  return await db.query('selectOpenInstructions', []);
}

module.exports = { findOpenInstructions };
