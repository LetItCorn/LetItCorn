// server/routers/m_returns_router.js
const express = require('express');
const router = express.Router();
const returnsService = require('../services/m_returns_service.js');

// 반품 전체 목록 조회
router.get('/m_returns', async (req, res) => {
  try {
    const list = await returnsService.findAllReturns();
    res.json(list);
  } catch (err) {
    console.error('반품 목록 조회 오류:', err);
    res.status(500).json({ error: '반품 목록 조회 중 오류' });
  }
});

// 반품 등록
router.post('/m_returns', async (req, res) => {
  try {
    const result = await returnsService.addReturn(req.body);
    res.json(result);
  } catch (err) {
    console.error('반품 등록 오류:', err);
    res.status(500).json({ error: '반품 등록 중 오류' });
  }
});

module.exports = router;
