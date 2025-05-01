const { query } = require('../database/mapper');
const { convertObjToAry } = require('../utils/converts');

// 모든 발주서 조회
async function findAllMOrders() {
  return await query('selectMOrderList', []);
}

// 단일 발주서 조회
async function findMOrderById(moder_id) {
  const rows = await query('selectMOrderOne', [moder_id]);
  return rows[0] || null;
}

// 발주서 등록
async function createMOrder(orderInfo) {
  const cols = [
    'moder_id', 'mater_code', 'moder_qty', 'moder_date',
    'moder_req', 'receiver', 'reference', 'due_date',
    'payment_term', 'partner_name', 'ceo_name', 'address',
    'business_type', 'contact'
  ];
  const data = convertObjToAry(orderInfo, cols);
  const res = await query('insertMOrder', data);
  return res && res.affectedRows > 0;
}

// 발주서 수정
async function updateMOrder(moder_id, mater_code, updateInfo) {
  const res = await query('updateMOrder', [updateInfo, moder_id, mater_code]);
  return res && res.affectedRows > 0;
}

// 발주서 삭제
async function deleteMOrder(moder_id, mater_code) {
  const res = await query('deleteMOrder', [moder_id, mater_code]);
  return res && res.affectedRows > 0;
}

module.exports = {
  findAllMOrders,
  findMOrderById,
  createMOrder,
  updateMOrder,
  deleteMOrder
};