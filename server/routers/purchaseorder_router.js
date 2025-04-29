const express = require('express');
const router = express.Router();
const poService = require('../services/purchaseorder_service.js');

router.get('/purchaseorders', async (req, res) => {
  const list = await poService.findAllPurchaseOrders();
  res.send(list);
});

router.get('/purchaseorders/:code', async (req, res) => {
  const code = req.params.code;
  const order = await poService.findPurchaseOrderByCode(code);
  res.send(order);
});

router.post('/purchaseorders', async (req, res) => {
  const info = req.body;
  const result = await poService.addPurchaseOrder(info);
  res.send(result);
});

router.put('/purchaseorders/:code', async (req, res) => {
  const code = req.params.code;
  const info = req.body;
  const result = await poService.updatePurchaseOrderInfo(code, info);
  res.send(result);
});

router.delete('/purchaseorders/:code', async (req, res) => {
  const code = req.params.code;
  const result = await poService.removePurchaseOrder(code);
  res.send(result);
});

module.exports = router;