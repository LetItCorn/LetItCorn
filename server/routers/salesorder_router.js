const express = require('express');
const router = express.Router();
const soServcie = require('../services/salesorder_service.js');

// 주문서 전체 조회
router.get('/salesorders', async (req, res) => {
    const salesOrderList = await soServcie.findAllSalesOrders();
    res.send(salesOrderList);
})



module.exports = router;