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

// J01 상태인 생산지시서만 조회
router.get('/instructions/open', async (req, res, next) => {
  try {
    const list = await svc.findOpenInstructions();  // J01만
    res.json(list);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
