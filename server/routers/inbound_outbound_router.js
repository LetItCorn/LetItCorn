const express = require('express');
const router = express.Router();
const svc = require('../services/inbound_outbound_service.js');

// 입고 목록 조회
router.get('/inbound', async (req, res) => {
  console.log('[Router] GET /inbound');
  const list = await svc.getInboundList();
  console.log('[Router] Response inbound count:', list.length);
  res.send(list);
});

// 출고 목록 조회
router.get('/outbound', async (req, res) => {
  console.log('[Router] GET /outbound');
  const list = await svc.getOutboundList();
  console.log('[Router] Response outbound count:', list.length);
  res.send(list);
});

// 입고 등록
router.post('/inbound', async (req, res) => {
  console.log('[Router] POST /inbound body:', req.body);
  const result = await svc.addInbound(req.body);
  console.log('[Router] POST /inbound result:', result);
  res.send(result);
});

// 출고 등록
router.post('/outbound', async (req, res) => {
  console.log('[Router] POST /outbound body:', req.body);
  const result = await svc.addOutbound(req.body);
  console.log('[Router] POST /outbound result:', result);
  res.send(result);
});

module.exports = router;