// server/routers/inbound_router.js
const express = require('express');
const router = express.Router();
const inboundService = require('../services/inbound_service.js');

// 1 전체 입고 이력 조회 
router.get('/m_inbound', async (req, res, next) => {
  try {
    const list = await inboundService.findAllInbounds();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// 2 입고 등록
router.post('/m_inbound', async (req, res, next) => {
  try {
    const { isSuccess, message } = await inboundService.addInbound(req.body);
    if (isSuccess) {
      return res.status(201).json({ success: true });
    }
    res.status(400).json({ success: false, message });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
