// server/routers/item_router.js

const express     = require('express');
const router      = express.Router();
const itemService = require('../services/item_service.js');

// 전체조회
router.get('/items', async (req,res)=>{
  let list = await itemService.findItems();
  res.send(list);
});

// 단건조회
router.get('/items/:item_code', async (req,res)=>{
  let itemCode = req.params.item_code;
  let info = await itemService.findByItem(itemCode);
  res.send(info);
});

// 등록
router.post('/items', async(req, res)=>{
  let itemInfo = req.body;
  let result = await itemService.createItem(itemInfo);
  res.send(result);
});

module.exports = router;
