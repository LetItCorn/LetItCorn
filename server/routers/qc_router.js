// server/routers/qc_router.js
const express = require('express');
const router = express.Router();
const qcService = require('../services/qc_service.js');

router.get('/test_qc', async (req, res, next) => {
  try {
    const items = await qcService.findAllTestQC();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// 품질검사 결과 일괄 저장
// 요청 바디로 아래 배열을 전달:
// [
//   { moder_id: '250416-00010', mater_code: '생크림', qc_result: 'PASS' },
//   { moder_id: '250415-00130', mater_code: '탈지분유', qc_result: 'FAIL' }
// ]
router.post('/qc_inspections', async (req, res) => {
  try {
    const results = req.body;
    const inspector = req.session.userId || 'unknown'; // 실사용자 ID
    await qcService.addQCInspections(results, inspector);
    res.send({ isSuccess: true, count: results.length });
  } catch (err) {
    console.error('QC 검사 저장 실패:', err);
    res.status(500).send({ error: '품질검사 저장 중 오류가 발생했습니다.' });
  }
});



module.exports = router;
