const mariadb = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

const findAllPurchaseOrders = async () => {
  return await mariadb.query('selectPurchaseOrderList')
    .catch(err => { console.error(err); return []; });
};

const findPurchaseOrderByCode = async (code) => {
  let list = await mariadb.query('selectPurchaseOrderOne', code)
    .catch(err => { console.error(err); return []; });
  return list[0] || null;
};

const addPurchaseOrder = async (orderInfo) => {
  const cols = ['porder_code','client_code','item_code','delivery_date','porder_count','manager','status'];
  const data = convertObjToAry(orderInfo, cols);
  let res = await mariadb.query('insertPurchaseOrder', data)
    .catch(err => { console.error(err); return null; });
  return { isSuccess: res && res.affectedRows > 0 };
};

const updatePurchaseOrderInfo = async (code, orderInfo) => {
  let res = await mariadb.query('updatePurchaseOrder', [orderInfo, code])
    .catch(err => { console.error(err); return null; });
  return { isUpdated: res && res.affectedRows > 0 };
};

const removePurchaseOrder = async (code) => {
  let res = await mariadb.query('deletePurchaseOrder', code)
    .catch(err => { console.error(err); return null; });
  return { isDeleted: res && res.affectedRows > 0 };
};

module.exports = {
  findAllPurchaseOrders,
  findPurchaseOrderByCode,
  addPurchaseOrder,
  updatePurchaseOrderInfo,
  removePurchaseOrder
};