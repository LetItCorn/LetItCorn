const db = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

// 입고 목록 조회
async function getInboundList() {
  console.log('[Service] getInboundList');
  const rows = await db.query('selectInboundList')
    .catch(err => { console.error('[Service] selectInboundList ERROR', err); return []; });
  console.log('[Service] Inbound rows:', rows.length);
  return rows;
}

// 출고 목록 조회
async function getOutboundList() {
  console.log('[Service] getOutboundList');
  const rows = await db.query('selectOutboundList')
    .catch(err => { console.error('[Service] selectOutboundList ERROR', err); return []; });
  console.log('[Service] Outbound rows:', rows.length);
  return rows;
}

// 입고 등록
async function addInbound(inInfo) {
  console.log('[Service] addInbound input:', inInfo);
  const cols = ['min_id','mater_code','min_qty','min_date','min_checker','mater_lot','tes_no','min_edate','min_stock','min_oqty'];
  const data = convertObjToAry(inInfo, cols);
  console.log('[Service] addInbound data:', data);
  const res = await db.query('insertInbound', data)
    .catch(err => { console.error('[Service] insertInbound ERROR', err); return null; });
  console.log('[Service] insertInbound result:', res);
  return { success: res && res.affectedRows > 0 };
}

// 출고 등록
async function addOutbound(outInfo) {
  console.log('[Service] addOutbound input:', outInfo);
  const cols = ['mout_id','mater_code','mout_qty','mout_date','mout_checker','lot_cnt','mater_lot'];
  const data = convertObjToAry(outInfo, cols);
  console.log('[Service] addOutbound data:', data);
  const res = await db.query('insertOutbound', data)
    .catch(err => { console.error('[Service] insertOutbound ERROR', err); return null; });
  console.log('[Service] insertOutbound result:', res);
  return { success: res && res.affectedRows > 0 };
}

module.exports = {
  getInboundList,
  getOutboundList,
  addInbound,
  addOutbound
};