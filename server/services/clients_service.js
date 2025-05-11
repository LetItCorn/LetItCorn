const { query } = require('../database/mapper');
const { selectClients } = require('../database/sqlList.js');

async function findAllClients() {
  console.log('--- selectClients SQL ---\\n', selectClients);   // ★ SQL 확인
  const list = await query('selectClients', []);
  console.log('--- clients result ---\\n', list);              // ★ 결과 확인
  return list;
}

module.exports = { findAllClients };
