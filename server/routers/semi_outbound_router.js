// server/routers/semi_outbound_router.js

const express = require('express');
const router  = express.Router();
const svc     = require('../services/semi_outbound_service.js');

/**
 * GET /api/semi/outbound/candidates
 * 외주 대상 생산지시 목록 조회
 */
router.get('/semi/outbound/candidates', async (req, res, next) => {
  try {
    const list = await svc.findAllForOutsource();
    res.json(list);
  } catch (err) {
    console.error('외주 대상 지시 조회 오류', err);
    next(err);
  }
});

/**
 * GET /api/semi/outbound/:instNo/components
 * 선택된 지시의 BOM 자재 목록 조회
 */
router.get('/semi/outbound/:instNo/components', async (req, res, next) => {
  try {
    const materials = await svc.findMaterialsByInstNo(req.params.instNo);
    res.json(materials);
  } catch (err) {
    console.error('BOM 자재 조회 오류', err);
    next(err);
  }
});

/**
 * POST /api/semi/outbound
 * 외주 자재 출고 처리
 */
router.post('/semi/outbound', async (req, res, next) => {
  try {
    const { instNo, clientCode, records } = req.body;
    const result = await svc.releaseMaterials(instNo, clientCode, records);
    res.json(result);
  } catch (err) {
    console.error('외주 자재 출고 오류', err);
    next(err);
  }
});

module.exports = router;
