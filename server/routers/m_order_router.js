// server/routers/m_order_router.js
const express = require('express');
const router  = express.Router();
const svc     = require('../services/m_order_service.js');


// 전체 발주서 + 상세 미포함 리스트 조회
// GET /m_orders
// 프로세스 흐름:
//  1 클라이언트에서 GET /m_orders 요청
//     
//  2 해당 라우트 핸들러 실행 → svc.findAllMOrders() 호출
//     
//  3 서비스 레이어에서 selectMOrderList 쿼리 실행 → DB 조회
//     
//  4 조회 결과(list) 반환 → 라우터
//     
//  5 res.json(list) 호출 → HTTP 200, JSON 배열 응답
router.get('/m_orders', async (req, res, next) => {
  try {
    const list = await svc.findAllMOrders();
    res.json(list);
  } catch (err) {
    next(err);
  }
});


// 특정 발주서 헤더 + 상세 조회
// GET /m_orders/:id
// 프로세스 흐름:
//  1 클라이언트에서 GET /m_orders/:id 요청
//     
//  2 router.get 핸들러 실행 → svc.getMOrderWithDetails(id) 호출
//     
//  3 서비스 레이어에서 헤더 조회 → details 조회
//     
//  4 결과(data) 객체 반환 → 라우터
//     
//  5 data 유무 확인:
//       • null → res.status(404).json({ message })
//       • 존재 → res.json(data)
router.get('/m_orders/:id', async (req, res, next) => {
  try {
    const data = await svc.getMOrderWithDetails(req.params.id);
    if (!data) return res.status(404).json({ message: '발주서를 찾을 수 없습니다.' });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// 헤더 + 상세 동시 등록
// POST /m_orders
// 프로세스 흐름:
//  1 클라이언트에서 POST /m_orders 요청 (req.body: { header, details })
//     
//  2 router.post 핸들러 실행 → svc.createMOrderWithDetails(header, details) 호출
//     
//  3 서비스 레이어에서 트랜잭션 실행 → 헤더/상세 INSERT
//     
//  4 성공 여부(success) 반환 → 라우터
//     
//  5 res.status(statusCode).json({ success }) 호출
//      success=true  → HTTP 201 Created
//      success=false → HTTP 400 Bad Request
router.post('/m_orders', async (req, res, next) => {
  try {
    const { header, details } = req.body;
    const success = await svc.createMOrderWithDetails(header, details);
    res.status(success ? 201 : 400).json({ success });
  } catch (err) {
    next(err);
  }
});

// PUT, DELETE 등 기타 라우트는 서비스 요구사항에 따라 추가
module.exports = router;
