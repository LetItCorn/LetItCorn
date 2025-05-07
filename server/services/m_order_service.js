// server/services/m_order_service.js
const { query, getConnection, selectedQuery } = require('../database/mapper');
const {
  selectMOrderList,
  selectMOrderOne,
  insertMOrder,
  updateMOrder,
  deleteMOrder,
  selectMOrderDetails,
  insertMOrderDetail
} = require('../database/sqlList.js');
const { convertObjToAry } = require('../utils/converts');

// 전체 발주서 조회
async function findAllMOrders() {
  return await query('selectMOrderList', []);
}

// 단일 헤더 조회
async function findMOrderById(moder_id) {
  const rows = await query('selectMOrderOne', [moder_id]);
  return rows[0] || null;
}

// 헤더 + 상세 조회
async function getMOrderWithDetails(moder_id) {
  const header = await findMOrderById(moder_id);
  if (!header) return null;
  const details = await query('selectMOrderDetails', [moder_id]);
  return { header, details };
}


//발주서(헤더 + 상세) 등록
async function createMOrderWithDetails(header, details) {
  const conn = await getConnection();
  try {
    await conn.beginTransaction();
    // 1) 헤더는 detail 한 건마다 PK(moder_id, mater_code)로 저장
    for (const d of details) {
      // 헤더 INSERT
      const headerParams = [
        header.moder_id,
        d.mater_code,
        d.qty,
        header.moder_date,
        header.moder_req,
        header.receiver,
        header.reference,
        header.due_date,
        header.payment_term,
        header.partner_name,
        header.ceo_name,
        header.address,
        header.business_type,
        header.contact
      ];
      await conn.query(
        selectedQuery('insertMOrder', headerParams),
        headerParams
      );

      // 상세 INSERT
      const detailParams = [
        header.moder_id,
        d.mater_code,
        d.product_name,
        d.spec,
        d.unit,
        d.qty,
        d.unit_price,
        d.supply_amount,
        d.tax_amount
      ];
      await conn.query(
        selectedQuery('insertMOrderDetail', detailParams),
        detailParams
      );
    }
    await conn.commit();
    return true;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// 기존 단일 행 헤더 등록은 더 이상 사용하지 않으므로 주석 처리하거나 삭제해도 됩니다.
// async function createMOrder(orderInfo) { … }

async function updateMOrderService(moder_id, mater_code, updateInfo) {
  const res = await query('updateMOrder', [updateInfo, moder_id, mater_code]);
  return res && res.affectedRows > 0;
}

async function deleteMOrderService(moder_id, mater_code) {
  const res = await query('deleteMOrder', [moder_id, mater_code]);
  return res && res.affectedRows > 0;
}

module.exports = {
  findAllMOrders,
  findMOrderById,
  getMOrderWithDetails,
  createMOrderWithDetails,
  updateMOrder: updateMOrderService,
  deleteMOrder: deleteMOrderService
};
