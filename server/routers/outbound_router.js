const express = require('express');
const router  = express.Router();
const svc     = require('../services/outbound_service.js');

router.get('/outbound_candidates', async (req, res) => {
  console.log('[Router] GET /outbound_candidates', req.query);
  const { from, to, inster, instHead } = req.query;
  const filters = [from || null, to || null, inster || null, instHead || null];
  const list = await svc.findOutboundCandidates(filters);
  res.send(list);
});

module.exports = router;