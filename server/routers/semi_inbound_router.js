// server/routers/semi_inbound_router.js

const express = require('express');
const router  = express.Router();
const svc     = require('../services/semi_inbound_service.js');

/**
 * POST /api/semi/inbound
 * 반제품 입고 처리
 */
router.post('/semi/inbound', async (req, res, next) => {
  try {
    const { instNo, materCode, qty } = req.body;
    const checker = req.session.userId || 'unknown';
    const result  = await svc.processSemiInbound(instNo, materCode, qty, checker);
    res.json(result);
  } catch (err) {
    console.error('반제품 입고 처리 오류', err);
    next(err);
  }
});

module.exports = router;
