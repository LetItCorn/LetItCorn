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


/**
 * 
 * findAllMOrders
 * 전체 발주서 목록 조회
 * 
 * 프로세스 흐름:
 * 1 클라이언트 또는 라우터에서 호출 -> findAllMOrders()
 * 
 * 2 query('selectMOrderList', []) 호출 -> mapper.query 내부 처리 
 * 
 * 3 mapper.query: SQL(selectMOrderList) 실행 -> DB에서 rows 반환
 * 
 * 4 서비스 -> 라우터 -> 클라이언트에 JSON 배열 응답 
 */
async function findAllMOrders() {
  return await query('selectMOrderList', []);
}



/**
 * 
 * 헤더 + 상세 정보 함께 조회
 * 
 * 프로세스 흐름:
 * 1 클라이언트에서 GET /m_order/:id/details 요청 -> 라우터 진입 
 * 
 * 2 getMOrderWithDetails(moder_id) 호출
 * 
 * 3 findMOrderById -> header 조회
 * 
 * 4 header가 없으면 null 반환 -> 클라이어튼에 404 또는 null
 * 
 * 5 selectMOrderDetails 쿼리 실행 -> details 배열 조회
 * 
 * 6 { header, details } 객체 반환 -> 클라이어트 응답
 * 
 */
async function findMOrderById(moder_id) {
  const rows = await query('selectMOrderOne', [moder_id]);
  return rows[0] || null;
}

/**
 * createMOrderWithDetails
 *  헤더 + 상세 동시 등록 (트랜잭션)
 *
 * 프로세스 흐름:
 *  1 클라이언트에서 POST /m_order/details 요청 -> 라우터 진입
 *     
 *  2 createMOrderWithDetails(header, details) 호출
 *     
 *  3 getConnection() -> DB 커넥션 획득
 *     
 *  4 conn.beginTransaction() -> 트랜잭션 시작
 *     
 *  5 for each detail in details:
 *    헤더 INSERT: conn.query(selectedQuery('insertMOrder', headerParams))
 *    상세 INSERT: conn.query(selectedQuery('insertMOrderDetail', detailParams))
 *     
 *  6 conn.commit() -> 트랜잭션 커밋
 *     
 *  7 true 반환 -> 성공 응답
 *  오류 발생 시: rollback -> 예외 throw -> finally에서 conn.release()
 */
async function getMOrderWithDetails(moder_id) {
  const header = await findMOrderById(moder_id);
  if (!header) return null;
  const details = await query('selectMOrderDetails', [moder_id]);
  return { header, details };
}


/**
 * createMOrderWithDetails
 *  헤더 + 상세 동시 등록 (트랜잭션)
 *
 * 프로세스 흐름:
 *  1 클라이언트에서 POST /m_order/details 요청 -> 라우터 진입
 *     
 *  2 createMOrderWithDetails(header, details) 호출
 *     
 *  3 getConnection() -> DB 커넥션 획득
 *     
 *  4 conn.beginTransaction() -> 트랜잭션 시작
 *     
 *  5 for each detail in details:
 *    헤더 INSERT: conn.query(selectedQuery('insertMOrder', headerParams))
 *    상세 INSERT: conn.query(selectedQuery('insertMOrderDetail', detailParams))
 *     
 *  6 conn.commit() -> 트랜잭션 커밋
 *     
 *  7 true 반환 -> 성공 응답
 *  오류 발생 시:rollback -> 예외 throw -> finally에서 conn.release()
 */
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

// 기존 단일 행 헤더 등록은 더 이상 사용하지 않으므로 주석 처리하거나 삭제
// async function createMOrder(orderInfo) { … }

// async function updateMOrderService(moder_id, mater_code, updateInfo) {
//   const res = await query('updateMOrder', [updateInfo, moder_id, mater_code]);
//   return res && res.affectedRows > 0;
// }

// async function deleteMOrderService(moder_id, mater_code) {
//   const res = await query('deleteMOrder', [moder_id, mater_code]);
//   return res && res.affectedRows > 0;
// }

module.exports = {
  findAllMOrders,
  findMOrderById,
  getMOrderWithDetails,
  createMOrderWithDetails,
  // updateMOrder: updateMOrderService,
  // deleteMOrder: deleteMOrderService
};
