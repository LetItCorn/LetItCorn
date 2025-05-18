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

// 거래처 목록 조회
router.get('/clients', async (req, res) => {
    try {
        const clients = await isoService.findAllClients();
        res.send(clients);
    } catch (err) {
        res.status(500).send({ error: '거래처 목록을 불러오는데 실패했습니다.' });
    }
});

// 품목 목록 조회
router.get('/items', async (req, res) => {
    try {
        const items = await isoService.findAllItems();
        res.send(items);
    } catch (err) {
        res.status(500).send({ error: '품목 목록을 불러오는데 실패했습니다.' });
    }
});

router.get('/salesorders/generate-scode', async (req, res) => {
    try {
        const result = await isoService.generateSalesOrderCode();
        res.send({ 
            isSuccessed: true,
            sorderCode: result 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ 
            isSuccessed: false,
            message: '주문번호 생성에 실패했습니다.' 
        });
    }
});

module.exports = router;