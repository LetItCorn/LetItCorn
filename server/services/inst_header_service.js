const { query } = require('../database/mapper.js');

async function findInstHeadersByStatus(stat = '대기') {
  return await query('selectInstHeadersByStatus', [stat]);
}

module.exports = { findInstHeadersByStatus };
