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

module.exports = router;