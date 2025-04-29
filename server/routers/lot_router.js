const express = require('express');
const router = express.Router();
const lotService = require('../services/lot_service.js');

// LOT 재고 조회
router.get('/lots', async (req, res) => {
  const list = await lotService.findLotInventory();
  res.send(list);
});

module.exports = router;