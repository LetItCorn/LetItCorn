// server/routers/material_qc_router.js
const express = require('express');
const router  = express.Router();
const svc     = require('../services/material_qc_service.js');

// 자재 품질검사 조회
router.get('/material_qc', async (req, res) => {
  console.log('[Router] GET /material_qc');
  const list = await svc.findAllMaterialQC();
  res.send(list);
});

router.post('/material_qc', async (req, res) => {
    console.log('[Router] POST /material_qc body:', req.body);
    const success = await svc.addMaterialQC(req.body.records);
    res.send({ success });
  });


module.exports = router;