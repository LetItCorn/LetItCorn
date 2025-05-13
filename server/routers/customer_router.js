const express = require('express');
const router = express.Router();
const customerService = require('../services/customer_service.js');

// 거래처 전체 조회
router.get('/customer', async (req, res) => {
    try {
        const customerList = await customerService.findAllCustomer();
        res.send(customerList);
    } catch (err) {
        res.status(500).send({ error: '거래처 목록을 불러오는데 실패했습니다.' });
    }
});



module.exports = router