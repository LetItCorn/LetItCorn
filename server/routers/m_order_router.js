const express = require('express');
const router = express.Router();
const mOrderService = require('../services/m_order_service');

// GET /m_orders  - 전체 조회
router.get('/m_orders', async (req, res, next) => {
  try {
    const list = await mOrderService.findAllMOrders();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /m_orders/:id  - 단건 조회
router.get('/m_orders/:id', async (req, res, next) => {
  try {
    const order = await mOrderService.findMOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: '발주서를 찾을 수 없습니다.' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// POST /m_orders  - 등록
router.post('/m_orders', async (req, res, next) => {
  try {
    const success = await mOrderService.createMOrder(req.body);
    res.status(success ? 201 : 400).json({ success });
  } catch (err) {
    next(err);
  }
});

// PUT /m_orders/:id/:code  - 수정
router.put('/m_orders/:id/:code', async (req, res, next) => {
  try {
    const { id, code } = req.params;
    const success = await mOrderService.updateMOrder(id, code, req.body);
    res.json({ success });
  } catch (err) {
    next(err);
  }
});

// DELETE /m_orders/:id/:code  - 삭제
router.delete('/m_orders/:id/:code', async (req, res, next) => {
  try {
    const { id, code } = req.params;
    const success = await mOrderService.deleteMOrder(id, code);
    res.json({ success });
  } catch (err) {
    next(err);
  }
});

module.exports = router;