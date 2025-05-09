// routes/Insertsalesorder_router.js
const express = require('express');
const router = express.Router();
const isoService = require('../services/Insertsalesorder_service.js');

// 주문서 등록
router.post('/salesorders', async (req, res) => {
    try {
        let orderinfo = req.body;
        console.log("요청 데이터 : ", orderinfo);
        let result = await isoService.addSalesOrder(orderinfo);
        console.log("서비스 결과 : ", result);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: '주문서 등록에 실패했습니다.' });
    }
});

module.exports = router;