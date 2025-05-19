// server/routers/semi_qc_router.js
const express = require('express');
const router  = express.Router();
const qcSvc   = require('../services/semi_qc_service.js');

/**
 * POST /api/semi/qc
 * 반제품 품질검사 결과 저장
 * 요청 바디: Array of { inst_no, qc_result }
 */
router.post('/semi/qc', async (req, res, next) => {
  try {
    const results   = req.body;
    const inspector = req.session.userId || 'unknown';
    await qcSvc.addSemiQcResults(results, inspector);
    res.json({ success: true, count: results.length });
  } catch (err) {
    console.error('반제품 QC 저장 오류', err);
    next(err);
  }
});

module.exports = router;
