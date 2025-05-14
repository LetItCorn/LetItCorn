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

// 거래처 조건별 검색
router.get('/customer/search', async (req, res) => {
    try {
        const conditions = {
            clientCode: req.query.clientCode,
            clientName: req.query.clientName,
            clientCeo: req.query.clientCeo,
            clientPhone: req.query.clientPhone,
            clientEmail : req.query.clientEmail,
            clientAddress: req.query.clientAddress,
            clientMgr: req.query.clientMgr,
            codeName: req.query.codeName
        };
        
        const customerOne = await customerService.findCustomerByCondition(conditions);
        res.send(customerOne);
    } catch (err) {
        res.status(500).send({ error: '거래처 검색에 실패했습니다.' });
    }
});

// 거래처 수정
router.put('/customer/:id', async (req, res) => {
    try {
        const clientCode = req.params.id;
        const updateData = req.body;
        const result = await customerService.updateCustomerInfo(clientCode, updateData);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: '거래처 수정에 실패했습니다.' });
    }
});

// 거래처 삭제
router.delete('/customer', async (req, res) => {
    try {
        const { clientIds } = req.body;
        
        // 여러 주문서 삭제 처리
        if (Array.isArray(clientIds)) {
            const results = await Promise.all(
                clientIds.map(id => customerService.removeCustomer(id))
            );
            res.send({ success: true, message: '선택한 거래처가 삭제되었습니다.' });
        } else {
            res.status(400).send({ error: '유효한 거래처 ID가 제공되지 않았습니다.' });
        }
    } catch (err) {
        res.status(500).send({ error: '거래처 삭제에 실패했습니다.' });
    }
});

// 단일 거래처 삭제
router.delete('/customer/:id', async (req, res) => {
    try {
        const clientCode = req.params.id;
        const result = await customerService.removeCustomer(clientCode);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: '거래처 삭제에 실패했습니다.' });
    }
});



module.exports = router