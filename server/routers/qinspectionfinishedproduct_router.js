const express = require('express');
const router = express.Router();
const QInspectionFproduct = require('../services/qinspectionfinishedproduct_service.js');

// 생산완료 전체 조회
router.get('/qfproduct', async (req, res) => {
    try {
        const qfproductList = await QInspectionFproduct.findAllQFinishedProduct();
        res.send(qfproductList);
    } catch (err) {
        res.status(500).send({ error: '생산완료 제품 목록을 불러오는데 실패했습니다.' });
    }
});

// 품질 검사 항목 리스트 조회
router.get('/qfproduct/inspection', async (req, res) => {
    try {
        const inspectionList = await QInspectionFproduct.inspectionQFProductList();
        res.send(inspectionList);
    } catch (err) {
        res.status(500).send({ error: '품질 검사 항목 리스트를 불러오는데 실패했습니다.' });
    }
});

module.exports = router;