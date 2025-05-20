// 라우터에 상태 업데이트 엔드포인트 추가

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

// 품질 검사 결과 저장 및 상태 업데이트
router.post('/qfproduct/inspection', async (req, res) => {
    try {
        // 데이터 검증
        if (!req.body || !Array.isArray(req.body) || req.body.length === 0) {
            return res.status(400).send({ error: '유효하지 않은 데이터 형식입니다.' });
        }
        
        const result = await QInspectionFproduct.saveInspectionResult(req.body);
        res.send(result);
    } catch (err) {
        console.error('검사 결과 저장 중 오류 발생:', err);
        res.status(500).send({ error: '검사 결과 저장에 실패했습니다.' });
    }
});

module.exports = router;