const express = require('express');
const router = express.Router();
const moService = require('../services/material_order_service.js');

// 자재 발주서 조회
router.get('/morders', async (req, res) => {
  console.log('[Router] GET /morders');
  const list = await moService.findAllMaterialOrders();
  console.log('[Router] /morders result count:', list.length);
  res.send(list);
});

// 발주서 상세
router.get('/morders/:id/details', async (req, res) => {
    const id = req.params.id;
    console.log('[Router] GET /morders/' + id + '/details');
    const detail = await moService.findMaterialOrderDetail(id);
    res.send(detail);
  });

module.exports = router;