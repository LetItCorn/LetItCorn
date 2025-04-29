// server/routers/bom_router.js
const express = require('express');
const router = express.Router();
const bomService = require('../services/bom_service.js');

// 1) BOM 목록 조회 (전체 또는 itemCode 필터)
//    GET /boms?itemCode=ITM001
router.get('/boms', async (req, res) => {
  const { itemCode } = req.query;
  try {
    const list = await bomService.findBoms(itemCode);
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'BOM 조회 중 오류가 발생했습니다.' });
  }
});

// 2) BOM 단건 조회 (bom_id 기준)
//    GET /boms/:bomId
router.get('/boms/:bomId', async (req, res) => {
  const { bomId } = req.params;
  try {
    const bom = await bomService.findBomById(bomId);
    if (!bom) return res.status(404).send({ error: '해당 BOM을 찾을 수 없습니다.' });
    res.send(bom);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'BOM 단건 조회 중 오류가 발생했습니다.' });
  }
});

// 3) BOM 등록
//    POST /boms
//    { bom_id, item_name, item_code }
router.post('/boms', async (req, res) => {
  try {
    await bomService.createBom(req.body);
    res.status(201).send({ message: 'BOM이 등록되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'BOM 등록 중 오류가 발생했습니다.' });
  }
});

// 4) BOM 수정
//    PUT /boms/:bomId
//    body: { item_name, item_code }
router.put('/boms/:bomId', async (req, res) => {
  const bom = { ...req.body, bom_id: req.params.bomId };
  try {
    await bomService.updateBom(bom);
    res.send({ message: 'BOM이 수정되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'BOM 수정 중 오류가 발생했습니다.' });
  }
});

// 5) BOM 삭제
//    DELETE /boms/:bomId
router.delete('/boms/:bomId', async (req, res) => {
  const { bomId } = req.params;
  try {
    await bomService.deleteBom(bomId);
    res.send({ message: 'BOM이 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'BOM 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
