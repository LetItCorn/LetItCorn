const express = require('express');
const router  = express.Router();
const svc     = require('../services/inst_header_service.js');

// GET /inst_headers?stat=대기
router.get('/inst_headers', async (req, res, next) => {
  try {
    const stat  = req.query.stat || '대기';
    const list  = await svc.findInstHeadersByStatus(stat);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
