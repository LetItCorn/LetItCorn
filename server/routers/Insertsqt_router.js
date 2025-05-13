// routes/Insertsqt_router.js
const express = require('express');
const router = express.Router();
const isqtService = require('../services/Insertsqt_service.js');

// 주문서 전체 조회
router.get('/insertsqt', async (req, res) => {
    try {
        const sqtList = await isqtService.findAllSqt();
        res.send(sqtList);
        console.log(sqtList);
    } catch (err) {
        res.status(500).send({ error: '출고량 목록을 불러오는데 실패했습니다.' });
    }
});

module.exports = router