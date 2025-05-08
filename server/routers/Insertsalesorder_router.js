// routes/Insertsalesorder_router.js
const express = require('express');
const router = express.Router();
const isoService = require('../services/Insertsalesorder_service.js');

// 주문서 등록
router.post('/salesorders', async (req, res) => {
    try {
        let orderinfo = req.body;
        let result = await isoService.addSalesOrder(orderinfo);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: '주문서 등록에 실패했습니다.' });
    }
});