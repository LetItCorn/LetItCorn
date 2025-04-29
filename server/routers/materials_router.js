// ==== routers/materials_router.js ==== 
const express = require('express');
const router = express.Router();
const materialService = require('../services/material_service.js');

// 전체 조회
router.get('/materials', async (req, res) => {
    const list = await materialService.findAllMaterials();
    res.send(list);
});

// 단건 조회
router.get('/materials/:code', async (req, res) => {
    const code = req.params.code;
    const material = await materialService.findMaterialByCode(code);
    res.send(material);
});

// 등록
router.post('/materials', async (req, res) => {
    const info = req.body;
    const result = await materialService.addMaterial(info);
    res.send(result);
});

// 수정
router.put('/materials/:code', async (req, res) => {
    const code = req.params.code;
    const info = req.body;
    const result = await materialService.updateMaterialInfo(code, info);
    res.send(result);
});

// 삭제
router.delete('/materials/:code', async (req, res) => {
    const code = req.params.code;
    const result = await materialService.removeMaterial(code);
    res.send(result);
});


module.exports = router;

