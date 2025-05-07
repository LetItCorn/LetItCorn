// routes/salesorder_router.js
const express = require('express');
const router = express.Router();
const soService = require('../services/salesorder_service.js');

// 주문서 전체 조회
router.get('/salesorders', async (req, res) => {
    try {
        const salesOrderList = await soService.findAllSalesOrders();
        res.send(salesOrderList);
    } catch (err) {
        res.status(500).send({ error: '주문서 목록을 불러오는데 실패했습니다.' });
    }
});

// 주문서 조건별 검색
router.get('/salesorders/search', async (req, res) => {
    try {
        const conditions = {
            deliveryDate: req.query.deliveryDate,
            orderCode: req.query.orderCode,
            clientName: req.query.clientName,
            itemName: req.query.itemName,
            clientMgr: req.query.clientMgr
        };
        
        const salesOrders = await soService.findSalesOrdersByCondition(conditions);
        res.send(salesOrders);
    } catch (err) {
        res.status(500).send({ error: '주문서 검색에 실패했습니다.' });
    }
});

// 주문서 상세 조회
router.get('/salesorders/:id', async (req, res) => {
    try {
        const orderCode = req.params.id;
        const salesOrder = await soService.findSalesOrderByCode(orderCode);
        
        if (!salesOrder) {
            return res.status(404).send({ error: '주문서를 찾을 수 없습니다.' });
        }
        
        res.send(salesOrder);
    } catch (err) {
        res.status(500).send({ error: '주문서 상세 정보를 불러오는데 실패했습니다.' });
    }
});

// 정렬 기능
router.get('/salesorders/sort/:type', async (req, res) => {
    try {
        const sortType = req.params.type;
        const salesOrders = await soService.findSalesOrdersBySort(sortType);
        res.send(salesOrders);
    } catch (err) {
        res.status(500).send({ error: '주문서 정렬에 실패했습니다.' });
    }
});

// 주문서 등록
router.post('/salesorders', async (req, res) => {
    try {
        const orderData = req.body;
        const result = await soService.addSalesOrder(orderData);
        res.status(201).send(result);
    } catch (err) {
        res.status(500).send({ error: '주문서 등록에 실패했습니다.' });
    }
});

// 주문서 수정
router.put('/salesorders/:id', async (req, res) => {
    try {
        const orderCode = req.params.id;
        const updateData = req.body;
        const result = await soService.updateSalesOrderInfo(orderCode, updateData);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: '주문서 수정에 실패했습니다.' });
    }
});

// 주문서 삭제
router.delete('/salesorders', async (req, res) => {
    try {
        const { orderIds } = req.body;
        
        // 여러 주문서 삭제 처리
        if (Array.isArray(orderIds)) {
            const results = await Promise.all(
                orderIds.map(id => soService.removeSalesOrder(id))
            );
            
            res.send({ success: true, message: '선택한 주문서가 삭제되었습니다.' });
        } else {
            res.status(400).send({ error: '유효한 주문서 ID가 제공되지 않았습니다.' });
        }
    } catch (err) {
        res.status(500).send({ error: '주문서 삭제에 실패했습니다.' });
    }
});

// 단일 주문서 삭제
router.delete('/salesorders/:id', async (req, res) => {
    try {
        const orderCode = req.params.id;
        const result = await soService.removeSalesOrder(orderCode);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: '주문서 삭제에 실패했습니다.' });
    }
});

// 거래처 목록 조회
router.get('/clients', async (req, res) => {
    try {
        const clients = await soService.findAllClients();
        res.send(clients);
    } catch (err) {
        res.status(500).send({ error: '거래처 목록을 불러오는데 실패했습니다.' });
    }
});

// 품목 목록 조회
router.get('/items', async (req, res) => {
    try {
        const items = await soService.findAllItems();
        res.send(items);
    } catch (err) {
        res.status(500).send({ error: '품목 목록을 불러오는데 실패했습니다.' });
    }
});

// 창고 목록 조회
router.get('/warehouses', async (req, res) => {
    try {
        const warehouses = await soService.findAllWarehouses();
        res.send(warehouses);
    } catch (err) {
        res.status(500).send({ error: '창고 목록을 불러오는데 실패했습니다.' });
    }
});

    module.exports = router;
