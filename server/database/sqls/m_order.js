// server/database/sqls/m_order.js

// M_ORDER 테이블 관련 SQL 정의 모듈
// 1) selectMOrderList: 전체 발주서 조회
//     최신 발주서 순(moder_date DESC)으로 정렬
//     DATE_FORMAT으로 날짜 형식 통일 (YYYY-MM-DD)
//    
// 동작 흐름:
//  1 서비스 레이어에서 "selectMOrderList" 식별자로 호출
//     
//  2 mapper.query('selectMOrderList') 실행 → DB에 SQL 전달
//     
//  3 DB에서 결과(rows) 반환 → JavaScript 객체 배열로 매핑
//     
//  4 서비스 → 라우터 → 컨트롤러 → 클라이언트에 JSON 응답
const selectMOrderList = `
SELECT
  m.moder_id,
  m.mater_code,
  m.moder_qty,
  DATE_FORMAT(m.moder_date, '%Y-%m-%d') AS moder_date,
  DATE_FORMAT(m.due_date, '%Y-%m-%d') AS due_date,
  m.received_qty,
  m.inbound_status,
  m.moder_req,
  m.receiver,
  m.reference,
  m.payment_term,
  m.partner_name,
  m.ceo_name,
  m.address,
  m.business_type,
  m.contact
FROM m_order m
ORDER BY m.moder_date DESC
`;

// selectMOrderOne: 단일 발주서(헤더) 조회
//     WHERE 절로 moder_id 파라미터 바인딩
//     날짜 형식 통일 (YYYY-MM-DD)
//    
// 동작 흐름:
//  1 GET /m_order/:id 라우트에서 moder_id 인자로 호출
//     
//  2 mapper.query('selectMOrderOne', [moder_id]) 실행
//     
//  3 DB에서 해당 발주서 한 건 조회 후 결과 반환
//     
//  4 서비스 → 라우터 → 클라이언트에 JSON 응답
const selectMOrderOne = `
SELECT
  moder_id,
  mater_code,
  moder_qty,
  DATE_FORMAT(moder_date, '%Y-%m-%d') AS moder_date,
  DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date,
  received_qty,
  inbound_status,
  moder_req,
  receiver,
  reference,
  payment_term,
  partner_name,
  ceo_name,
  address,
  business_type,
  contact
FROM m_order
WHERE moder_id = ?
`;

// insertMOrder: 발주서 등록
// INSERT INTO m_order (...) VALUES (?, ?, ...)
//    
// 동작 흐름:
//  1 POST /m_order 라우트에서 요청 바디로 발주서 정보 수신
//     
//  2 mapper.query('insertMOrder', dataArray) 실행
//     
//  3 DB에 INSERT 수행 → affectedRows 반환
//     
//  4 서비스에서 성공 여부 확인 후 결과 반환
const insertMOrder = `
INSERT INTO m_order (
  moder_id,
  mater_code,
  moder_qty,
  moder_date,
  moder_req,
  receiver,
  reference,
  due_date,
  payment_term,
  partner_name,
  ceo_name,
  address,
  business_type,
  contact
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;


// updateMOrder: 발주서 수정
// UPDATE m_order SET ? WHERE moder_id = ? AND mater_code = ?
//    
// 동작 흐름:
//  1 PUT/PATCH /m_order/:id 라우트에서 수정 데이터 및 moder_id, mater_code 수신
//     
//  2 mapper.query('updateMOrder', [updateDataObj, moder_id, mater_code]) 실행
//     
//  3 DB에 UPDATE 수행 → affectedRows 반환
//     
//  4 서비스에서 결과 반환 → 클라이언트 응답
const updateMOrder = `
UPDATE m_order
  SET ?
  WHERE moder_id = ? AND mater_code = ?
`;


// deleteMOrder: 발주서 삭제
//   DELETE FROM m_order WHERE moder_id = ? AND mater_code = ?
//    
// 동작 흐름:
//  1 DELETE /m_order/:id 라우트에서 moder_id, mater_code 수신
//     
//  2 mapper.query('deleteMOrder', [moder_id, mater_code]) 실행
//     
//  3 DB에 DELETE 수행 → affectedRows 반환
//     
//  4 서비스에서 결과 반환 → 클라이언트 응답
const deleteMOrder = `
DELETE FROM m_order
  WHERE moder_id = ? AND mater_code = ?
`;

module.exports = {
  selectMOrderList,
  selectMOrderOne,
  insertMOrder,
  updateMOrder,
  deleteMOrder
};
