// server/routers/item_router.js

const express     = require('express');
const router      = express.Router();
const itemService = require('../services/item_service.js');

// 1) 조회 (전체 조회 + 검색 조건)
router.get('/items', async (req, res) => {
  const { searchType, searchValue } = req.query;
  try {
    const list = await itemService.findItems(searchType, searchValue);
    res.json(list);
  } catch (err) {
    res.status(500).send('조회 중 오류 발생');
  }
});

// 2) 등록
router.post('/items', async (req, res) => {
  try {
    await itemService.createItem(req.body);
    res.status(201).send('등록 성공');
  } catch (err) {
    res.status(500).send('등록 중 오류 발생');
  }
});

// 3) 수정
router.put('/items/:code', async (req, res) => {
  const item = { ...req.body, item_code: req.params.code };
  try {
    await itemService.updateItem(item);
    res.send('수정 성공');
  } catch (err) {
    res.status(500).send('수정 중 오류 발생');
  }
});

// 4) 삭제
router.delete('/items/:code', async (req, res) => {
  try {
    await itemService.deleteItem(req.params.code);
    res.send('삭제 성공');
  } catch (err) {
    res.status(500).send('삭제 중 오류 발생');
  }
});

module.exports = router;
