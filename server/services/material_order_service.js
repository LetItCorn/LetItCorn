const db = require('../database/mapper.js');

// 자재 발주서 목록 조회
async function findAllMaterialOrders() {
  console.log('[Service] findAllMaterialOrders called');
  const rows = await db.query('selectMaterialOrderList')
    .catch(err => { console.error('[Service] selectMaterialOrderList ERROR', err); return []; });
  console.log('[Service] MaterialOrders count:', rows.length);
  return rows;
}

// 발주서 상세 라인 아이템 조회
const findMaterialOrderDetail = async (orderId) => {
    console.log('[Service] findMaterialOrderDetail for', orderId);
    const rows = await db.query('selectMaterialOrderDetail', orderId)
      .catch(err => { console.error(err); return []; });
    console.log('[Service] Detail rows:', rows.length);
    return rows;
  };
  

module.exports = {
  findAllMaterialOrders,
  findMaterialOrderDetail
};
