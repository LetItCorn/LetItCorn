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

// 품질 검사 결과 저장 (기존 API)
router.post('/qfproduct/inspection', async (req, res) => {
    try {
        // 필수 필드 검증
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

// MySQL 프로시저 호출을 위한 라우터 추가
router.post('/qfproduct/callProcedure', async (req, res) => {
    const { procedureName, params } = req.body;
    
    if (procedureName !== 'INSERTQCLOG') {
        return res.status(400).send({ error: '허용되지 않은 프로시저입니다.' });
    }
    
    try {
        // 서비스 계층의 메소드 호출
        const result = await QInspectionFproduct.callInsertQcLogProcedure(params);
        res.send(result);
    } catch (err) {
        console.error('프로시저 호출 중 오류 발생:', err);
        res.status(500).send({ error: '프로시저 실행 중 오류가 발생했습니다.' });
    }
});
module.exports = router;