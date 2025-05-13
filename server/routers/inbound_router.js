// server/routers/inbound_router.js
const express = require('express');
const router = express.Router();
const inboundService = require('../services/inbound_service.js');

// 전체 입고 이력 조회
router.get('/m_inbound', async (req, res) => {
  try {
    const list = await inboundService.findAllInbounds();
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '입고 이력 조회 중 오류.' });
  }
}); 
/**
 * 위의 코드 흐름
 * 
 * 1. 클라이언트에서 GET 요청 '/api/m_inbound' 호출
 * 
 * 2. router.get 핸들러 생성
 * 
 * 3. inboundService.findAllInbounds() 호출 -> 서비스 레이어 진입
 * 
 * 4. mapper.query('selectInboundList') 실행 -> DB에서 입고 이력 조회
 * 
 * 5. 조회 결과(list) 반환 -> 서비스 -> 라우터
 * 
 * 6. res.send(list) 호출 -> 클라이언트에 JSON 배열 응답
 */



// 입고 등록
router.post('/m_inbound', async (req, res) => {
  try {
    const result = await inboundService.addInbound(req.body);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '입고 등록 중 오류.' });
  }
});

/**
 * 위의 코드 흐름
 * 1. 클라이언트에서 post 요청 '/api/m_inbound' 호출 (req.body에 입고 정보 포함)
 * 
 * 2. router.post 핸들러 실행
 * 
 * 3. inboundService.addInbound(req.body) 호출 -> 서비스 레이어 진입
 * 
 * 4. 서비스에서 convertObjToAry -> mapper.query(insertInbound', data) 실행 -> DB에 insert
 * 
 * 5. insert 결과(res) 반환 -> 서비스 -> 라우터
 * 
 * 6. res.send(result) 호출 -> 클라이언트에 처리 결과 JSON 응답
 */

module.exports = router;