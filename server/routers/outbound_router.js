const express  = require('express');
const router   = express.Router();
const svc      = require('../services/outbound_service.js');

/* 1) 출고 이력 전체 */
router.get('/m_outbound', async (req, res, next) => {
  try {
    res.json(await svc.findAllOutbounds());
  } catch (err) { next(err); }
});

/* 2) 생산지시 기반 LOT 후보 */
router.get('/outbound_candidates/instruction/:instHead', async (req, res, next) => {
  try {
    const list = await svc.findOutboundCandidates(req.params.instHead);
    res.json(list);
  } catch (err) { next(err); }
});

/* 3) 출고 INSERT */
router.post('/m_outbound', async (req, res, next) => {
  try {
    const result = await svc.addOutbound(req.body);
    res.json(result);
  } catch (err) { next(err); }
});

/* 4) 출고 롤백 */
router.delete('/m_outbound/:moutId', async (req, res, next) => {
  try {
    const ok = await svc.cancelOutbound(req.params.moutId);
    res.json({ success: ok });
  } catch (err) { next(err); }
});

/* 5) 피킹 리스트 PDF */
router.get('/m_outbound/picking-list', async (req, res, next) => {
  try {
    const ids = Array.isArray(req.query.ids)
      ? req.query.ids
      : (req.query.ids ? [req.query.ids] : []);
    if (!ids.length) return res.status(400).send('ids 파라미터 필요');
    await svc.generatePickingListPDF(ids, res);
  } catch (err) { next(err); }
});

module.exports = router;
