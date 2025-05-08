// server/routers/outbound_router.js

const express = require('express');
const router = express.Router();
const outboundService = require('../services/outbound_service.js');

// 전체 출고 이력 조회
router.get('/m_outbound', async (req, res) => {
  try {
    const list = await outboundService.findAllOutbounds();
    res.send(list);
  } catch (err) {
    console.error('출고 이력 조회 오류:', err);
    res.status(500).send({ error: '출고 이력 조회 중 오류가 발생했습니다.' });
  }
});

// 출고 후보 조회
router.get('/outbound_candidates', async (req, res) => {
  try {
    const list = await outboundService.findOutboundCandidates();
    res.json(list);
  } catch (err) {
    console.error('[Router] GET /outbound_candidates 오류:', err);
    res.status(500).json({ error: '출고 후보 조회 중 오류' });
  }
});


// // 출고 등록
// router.post('/m_outbound', async (req, res) => {
//   try {
//     const result = await outboundService.addOutbound(req.body);
//     if (!result.isSuccess) {
//     // 재고 부족 등 클라이언트 오류
//     return res.status(400).json({ error: result.error });
//     }
//     res.json(result);
//   } catch (err) {
//     console.error('출고 등록 오류:', err);
//     res.status(500).send({ error: '출고 등록 중 오류가 발생했습니다.' });
//   }
// });


// 출고 취소(롤백)
router.delete('/m_outbound/:id', async (req, res) => {
  try {
    const success = await outboundService.cancelOutbound(req.params.id);
    if (!success) {
      return res.status(404).json({ error: '삭제할 출고 기록이 없습니다.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('출고 취소 오류:', err);
    res.status(500).json({ error: '출고 취소 중 오류가 발생했습니다.' });
  }
});

// 5) 피킹 리스트 출력 (PDF)
router.get('/m_outbound/picking-list', async (req, res) => {
  try {
    // ids 파라미터를 JSON 배열로 받을 수도, CSV 문자열로 받을 수도 있습니다.
    let ids = [];
    if (req.query.ids) {
      // 예: ?ids=OUT001,OUT002,...
      ids = Array.isArray(req.query.ids)
        ? req.query.ids
        : req.query.ids.split(',');
    }
    if (!ids.length) {
      return res.status(400).send('출고ID 목록(ids)이 필요합니다.');
    }
    await outboundService.generatePickingListPDF(ids, res);
  } catch(err) {
    console.error('피킹 리스트 출력 오류:', err);
    if (!res.headersSent) {
      res.status(500).send('피킹 리스트 생성 중 오류');
    }
  }
});

module.exports = router;
