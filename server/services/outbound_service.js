const db = require('../database/mapper.js');

/**
 * 자재 출고 처리 후보 목록 조회
 * @param {[from, to, inster, instHead]} filters 
 */
async function findOutboundCandidates(filters = [null, null, null, null]) {
  console.log('[Service] findOutboundCandidates filters:', filters);
  const rows = await db.query('selectOutboundCandidates', filters)
    .catch(err => {
      console.error('[Service] selectOutboundCandidates ERROR', err);
      return [];
    });
  console.log('[Service] Outbound candidates count:', rows.length);
  return rows;
}

module.exports = {
  findOutboundCandidates
};
