// server/routers/item_router.js

const express     = require('express');
const router      = express.Router();
const itemService = require('../services/item_service.js');

// 전체조회 + 조건검색
// 쿼리스트링: ?code=xxx&name=yyy&type=zzz
router.get('/items', async (req, res) => {
  const { code = '', name = '', type = '' } = req.query;
  const list = await itemService.findItems({ code, name, type });
  res.send(list);
});

// 단건조회
router.get('/items/:item_code', async (req, res) => {
  const itemCode = req.params.item_code;
  const info     = await itemService.findByItem(itemCode);
  res.send(info);
});

// 등록
router.post('/items', async (req, res) => {
  const itemInfo = req.body;
  const result   = await itemService.createItem(itemInfo);
  res.send(result);
});

// 수정
router.put('/items/:item_code', async (req, res) => {
  // URL param 에서 item_code 꺼내서 body 에 병합
  const itemInfo = { ...req.body, item_code: req.params.item_code };
  const result   = await itemService.updateItem(itemInfo);
  res.send(result);
});

// 삭제
router.delete('/items/:item_code', async (req, res) => {
  const itemCode = req.params.item_code;
  const result   = await itemService.deleteItem(itemCode);
  res.send(result);
});

module.exports = router;
