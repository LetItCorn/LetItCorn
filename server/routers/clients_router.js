const express = require('express');
const router = express.Router();
const svc = require('../services/clients_service.js');

// GET /clients → 전체 거래처 반환
router.get('/m_clients', async (req, res, next) => {
  try {
    const list = await svc.findAllClients();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
