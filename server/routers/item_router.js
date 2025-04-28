const express = require('express');
const router = express.Router();
const itemService = require('../services/item_service.js');

// 품목 전체 조회
router.get('/items', async (req, res) => {
  let list = await itemService.findAll()
  .catch(err =>console.log(err));
  res.send(list);
});

module.exports = router;