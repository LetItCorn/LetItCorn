// server/services/m_order_service.js
const { getConnection, selectedQuery, query } = require('../database/mapper');

/** 전체 발주서 + 상세 JOIN */
async function findAllMOrders() {
  return await query('selectMOrderList', []);
}

/** 단건 헤더 */
async function findMOrderById(moder_id) {
  const rows = await query('selectMOrderOne', [ moder_id ]);
  return rows[0] || null;
}

/** 헤더 + 상세 */
async function getMOrderWithDetails(moder_id) {
  const header = await findMOrderById(moder_id);
  if (!header) return null;
  const details = await query('selectMOrderDetails', [ moder_id ]);
  return { header, details };
}

/** 등록 */
async function createMOrderWithDetails(header, details) {
  const conn = await getConnection();
  try {
    await conn.beginTransaction();

    /* 1) 헤더 INSERT  */
    const headerParams = [
      header.moder_id,
      header.moder_date,     
      header.moder_req,
      header.receiver,
      header.reference,
      header.due_date,
      header.payment_term,
      header.reg_number,
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

    /* 2) 상세 INSERT 반복 */
    for (const d of details) {
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
    console.error('[Service] createMOrderWithDetails ERROR', err.sqlMessage || err);
    return false;
  } finally {
    conn.release();
  }
}

module.exports = {
  findAllMOrders,
  findMOrderById,
  getMOrderWithDetails,
  createMOrderWithDetails
};
