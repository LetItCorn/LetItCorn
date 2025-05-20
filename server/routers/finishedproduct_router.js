const express = require('express');
const router = express.Router();
const FinishedProductService = require('../services/finishedproduct_service.js');

// 완제품 전체 조회
router.get('/fproduct', async (req, res) => {
    console.log('GET /api/fproduct 요청 수신');
    try {
        const fproductList = await FinishedProductService.findAllFinishedProduct();
        res.send(fproductList);
    } catch (err) {
        res.status(500).send({ error: '완제품 목록을 불러오는데 실패했습니다.' });
    }
}); 


module.exports = router