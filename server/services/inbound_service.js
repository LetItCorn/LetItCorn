// services/inbound_service.js
const { query, getConnection, selectedQuery } = require('../database/mapper');
const { convertObjToAry } = require('../utils/converts');

const COLS = [
  'min_id','moder_id','mater_code','min_qty','min_date',
  'min_checker','mater_lot','min_edate','min_stock','min_oqty','test_no'
];

// ───────────────────────────────────────────────────────────
// 전체 입고 이력 조회
// ───────────────────────────────────────────────────────────
async function findAllInbounds() {
  return await query('selectInboundList', []);
}

// ───────────────────────────────────────────────────────────
// 단일 입고 등록 + 재고 누적
// ───────────────────────────────────────────────────────────
async function addInbound(inboundInfo) {
  console.log('[DEBUG] inboundInfo', inboundInfo);               // ★ DEBUG

  const data = convertObjToAry(inboundInfo, COLS);
  const conn = await getConnection();

  try {
    await conn.beginTransaction();

    // 1) m_inbound INSERT
    const ins = await conn.query(
      selectedQuery('insertInbound', data),
      data
    );
    console.log('[DEBUG] insert rows =', ins.affectedRows);       // ★ DEBUG

    // 2) 자재 재고 누적
    const upd = await conn.query(
      selectedQuery('updateMaterialStock', [
        inboundInfo.min_qty,
        inboundInfo.mater_code
      ]),
      [ inboundInfo.min_qty, inboundInfo.mater_code ]
    );
    console.log('[DEBUG] stock rows  =', upd.affectedRows);       // ★ DEBUG

    await conn.commit();
    return { isSuccess: true };
  } catch (err) {
    await conn.rollback();
    console.error('[Service] addInbound ERROR', err.sqlMessage || err);
    return { isSuccess: false, message: err.sqlMessage };
  } finally {
    conn.release();
  }
}

module.exports = {
  findAllInbounds,
  addInbound
};
