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
    return res.json(list);
  } catch (err) {
    console.error('출고 이력 조회 오류', err);
    return res.status(500).json({ error: '출고 이력 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 2) 생산지시 기반 LOT 후보 조회
 *    GET /outbound_candidates/instruction/:instHead
 */
router.get('/outbound_candidates/instruction/:instHead', async (req, res) => {
  try {
    const list = await svc.findOutboundCandidates(req.params.instHead);
    return res.json(list);
  } catch (err) {
    console.error('출고 후보 조회 오류:', err);
    return res.status(500).json({ error: '출고 후보 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 3) 단건 출고 INSERT
 *    POST /m_outbound
 */
router.post('/m_outbound', async (req, res) => {
  try {
    const result = await svc.addOutbound(req.body);
    return res.json(result);
  } catch (err) {
    console.error('단건 출고 처리 오류:', err);
    return res.status(500).json({ error: '출고 처리 중 오류가 발생했습니다.' });
  }
});

/**
 * 4) 생산지시 기반 출고 일괄 처리 (단일 트랜잭션)
 *    POST /m_outbound/instruction
 */
router.post('/m_outbound/instruction', async (req, res) => {
  try {
    const { inst_head, records } = req.body;
    const result = await svc.addBulkOutbound(inst_head, records);
    return res.json(result);
  } catch (err) {
    console.error('일괄 출고 처리 오류:', err);
    return res.status(500).json({ error: '일괄 출고 처리 중 오류가 발생했습니다.' });
  }
});

/**
 * 5) 출고 롤백 (삭제)
 *    DELETE /m_outbound/:moutId
 */
router.delete('/m_outbound/:moutId', async (req, res) => {
  try {
    const ok = await svc.cancelOutbound(req.params.moutId);
    return res.json({ success: ok });
  } catch (err) {
    console.error('출고 롤백 오류:', err);
    return res.status(500).json({ error: '출고 롤백 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
