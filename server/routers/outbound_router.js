// server/routers/outbound_router.js

const express  = require('express');
const router   = express.Router();
const svc      = require('../services/outbound_service.js');

/**
 * 1) 전체 출고 이력 조회
 *    GET /m_outbound
 */
router.get('/m_outbound', async (req, res, next) => {
  try {
    const list = await svc.findAllOutbounds();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

/**
 * 2) 생산지시 기반 LOT 후보 조회
 *    GET /outbound_candidates/instruction/:instHead
 */
router.get('/outbound_candidates/instruction/:instHead', async (req, res, next) => {
  try {
    const list = await svc.findOutboundCandidates(req.params.instHead);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

/**
 * 3) 단건 출고 INSERT
 *    POST /m_outbound
 */
router.post('/m_outbound', async (req, res, next) => {
  try {
    const result = await svc.addOutbound(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * 4) 생산지시 기반 출고 일괄 처리
 *    POST /m_outbound/instruction
 */
router.post('/m_outbound/instruction', async (req, res, next) => {
  try {
    const { inst_head, records } = req.body;
    const results = [];
    for (const r of records) {
      const info = { inst_head, ...r };
      const result = await svc.addOutbound(info);
      results.push(result);
      if (!result.isSuccess) break;
    }
    const success = results.every(r => r.isSuccess);
    res.status(success ? 200 : 400).json({ success, results });
  } catch (err) {
    next(err);
  }
});

/**
 * 5) 출고 롤백 (삭제)
 *    DELETE /m_outbound/:moutId
 */
router.delete('/m_outbound/:moutId', async (req, res, next) => {
  try {
    const ok = await svc.cancelOutbound(req.params.moutId);
    res.json({ success: ok });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
