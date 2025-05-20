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
                sorderCode: req.query.sorderCode,
                clientName: req.query.clientName,
                clientMgr: req.query.clientMgr,
                itemName: req.query.itemName,
                sorderCount : req.query.sorderCount,
                deliveryDate: req.query.deliveryDate
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

    // 주문서 수정
    router.put('/salesorders/:id', async (req, res) => {
        try {
            const sorderCode = req.params.id;
            const updateData = req.body;
            const result = await soService.updateSalesOrderInfo(sorderCode, updateData);
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

    // 출고 이력 조회
router.get('/salesorders/shipments', async (req, res) => {
    try {
        const shipmentList = await soService.findAllShipments();
        res.send(shipmentList);
    } catch (err) {
        res.status(500).send({ error: '출고 이력을 불러오는데 실패했습니다.' });
    }
});

// 출고 등록
router.post('/salesorders/shipment', async (req, res) => {
    try {
        const shipmentData = req.body;
        
        // 필수 데이터 검증
        if (!shipmentData.sorder_code || !shipmentData.item_code || 
            !shipmentData.shipment_qty || shipmentData.shipment_qty <= 0) {
            return res.status(400).send({ 
                success: false, 
                message: '유효하지 않은 데이터 형식입니다.' 
            });
        }
        
        const result = await soService.registerShipment(shipmentData);
        res.send(result);
    } catch (err) {
        console.error('출고 등록 중 오류 발생:', err);
        res.status(500).send({ success: false, message: '출고 등록에 실패했습니다.' });
    }
});

    module.exports = router;
