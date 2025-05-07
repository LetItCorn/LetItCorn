// server/routers/materials_router.js
const express = require('express');
const router = express.Router();
const materialService = require('../services/material_service.js');

// 1) 전체 자재 목록 조회
router.get('/materials', async (req, res) => {
  try {
    const list = await materialService.findAllMaterials();
    res.json(list);
  } catch (err) {
    console.error('[Router] GET /materials 오류:', err);
    res.status(500).json({ error: '전체 자재 목록 조회 중 오류' });
  }
});

// 2) 자재 LOT 목록 조회
router.get('/materials/lots', async (req, res) => {
  try {
    const list = await materialService.findAllMAtLOTlist();
    res.json(list);
  } catch (err) {
    console.error('[Router] GET /materials/lots 오류:', err);
    res.status(500).json({ error: 'LOT별 자재 목록 조회 중 오류' });
  }
});

// 3) **실시간 재고 현황 조회** (이 라우트가 /materials/:code 보다 위에 있어야 합니다)
router.get('/materials/stock', async (req, res) => {
  try {
    const list = await materialService.findMaterialStock();
    res.json(list);
  } catch (err) {
    console.error('[Router] GET /materials/stock 오류:', err);
    res.status(500).json({ error: '재고 현황 조회 중 오류' });
  }
});

// 4) 단건 자재 조회
router.get('/materials/:code', async (req, res) => {
  try {
    const material = await materialService.findMaterialByCode(req.params.code);
    if (!material) {
      return res.status(404).json({ message: '해당 자재를 찾을 수 없습니다.' });
    }
    res.json(material);
  } catch (err) {
    console.error('[Router] GET /materials/:code 오류:', err);
    res.status(500).json({ error: '단건 자재 조회 중 오류' });
  }
});


// 4) 자재 등록
router.post('/materials', async (req, res) => {
  try {
    const result = await materialService.addMaterial(req.body);
    if (result.isSuccess) {
      return res.status(201).json(result);
    }
    res.status(400).json(result);
  } catch (err) {
    console.error('[Router] POST /materials 오류:', err);
    res.status(500).json({ error: '자재 등록 중 오류' });
  }
});

// 5) 자재 수정
router.put('/materials/:code', async (req, res) => {
  try {
    const result = await materialService.updateMaterialInfo(req.params.code, req.body);
    res.json(result);
  } catch (err) {
    console.error('[Router] PUT /materials/:code 오류:', err);
    res.status(500).json({ error: '자재 수정 중 오류' });
  }
});

// 6) 자재 삭제
router.delete('/materials/:code', async (req, res) => {
  try {
    const result = await materialService.removeMaterial(req.params.code);
    res.json(result);
  } catch (err) {
    console.error('[Router] DELETE /materials/:code 오류:', err);
    res.status(500).json({ error: '자재 삭제 중 오류' });
  }
});




module.exports = router;
