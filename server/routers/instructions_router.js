/* instructions_router.js */
const express = require('express');
const router  = express.Router();
const svc     = require('../services/instructions_service.js');

/* GET /instructions/open  →  대기 상태 생산지시 목록 */
router.get('/instructions/open', async (req, res, next) => {
  try {
    const list = await svc.findOpenInstructions();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
