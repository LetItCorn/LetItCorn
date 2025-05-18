// server/routers/m_order_router.js
const express = require('express');
const router  = express.Router();
const svc     = require('../services/m_order_service.js');

router.get('/m_orders', async (req, res, next) => {
  try {
    const list = await svc.findAllMOrders();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.get('/m_orders/:id', async (req, res, next) => {
  try {
    const data = await svc.getMOrderWithDetails(req.params.id);
    if (!data) return res.status(404).json({ message: '발주서를 찾을 수 없습니다.' });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/m_orders', async (req, res, next) => {
  try {
    const { header, details } = req.body;
    const success = await svc.createMOrderWithDetails(header, details);
    res.status(success ? 201 : 400).json({ success });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
