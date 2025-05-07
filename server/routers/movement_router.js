// server/routers/movement_router.js
const express = require('express');
const router = express.Router();
const inboundService  = require('../services/inbound_service.js');
const outboundService = require('../services/outbound_service.js');

/**
 * 자재 입/출고 조회
 * Query param:
 *   type=inbound  → 입고 이력 반환
 *   type=outbound → 출고 이력 반환
 */
router.get('/m_movement', async (req, res) => {
  const { type } = req.query;
  try {
    if (type === 'inbound') {
      const list = await inboundService.findAllInbounds();
      return res.send(list);
    }
    if (type === 'outbound') {
      const list = await outboundService.findAllOutbounds();
      return res.send(list);
    }
    res.status(400).send({ error: 'type 파라미터는 inbound 또는 outbound 이어야 합니다.' });
  } catch (err) {
    console.error('입/출고 조회 오류:', err);
    res.status(500).send({ error: '입/출고 조회 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
