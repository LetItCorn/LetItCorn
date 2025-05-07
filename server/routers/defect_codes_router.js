// server/routers/defect_codes_router.js

const express = require('express');
const router = express.Router();
const defectService = require('../services/defect_codes_service.js');

/**
 * 1) 전체조회 + 필터 조회
 *    GET /defect_codes?code=DC001&type=포장불량&isUsed=01
 */
router.get('/defect_codes', async (req, res) => {
  const { code = '', type = '', isUsed = '' } = req.query;
  try {
    const list = await defectService.findDefectCodes({ code, type, isUsed });
    res.json(list);
  } catch (err) {
    console.error('GET /defect_codes error:', err);
    res.status(500).json({ error: '불량 코드 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 2) 단건조회
 *    GET /defect_codes/:defect_code
 */
router.get('/defect_codes/:defect_code', async (req, res) => {
  const code = req.params.defect_code;
  try {
    const info = await defectService.findDefectCode(code);
    if (!info) return res.status(404).json({ error: '해당 불량 코드를 찾을 수 없습니다.' });
    res.json(info);
  } catch (err) {
    console.error(`GET /defect_codes/${code} error:`, err);
    res.status(500).json({ error: '불량 코드 단건 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 3) 등록
 *    POST /defect_codes
 *    body: { defect_code, defect_type, is_used, created_date }
 */
router.post('/defect_codes', async (req, res) => {
  try {
    await defectService.createDefectCode(req.body);
    res.status(201).json({ message: '불량 코드가 등록되었습니다.' });
  } catch (err) {
    console.error('POST /defect_codes error:', err);
    res.status(500).json({ error: '불량 코드 등록 중 오류가 발생했습니다.' });
  }
});

/**
 * 4) 수정
 *    PUT /defect_codes/:defect_code
 *    body: { defect_type, is_used, created_date }
 */
router.put('/defect_codes/:defect_code', async (req, res) => {
  const code = req.params.defect_code;
  const payload = { ...req.body, defect_code: code };
  try {
    await defectService.updateDefectCode(payload);
    res.json({ message: '불량 코드가 수정되었습니다.' });
  } catch (err) {
    console.error(`PUT /defect_codes/${code} error:`, err);
    res.status(500).json({ error: '불량 코드 수정 중 오류가 발생했습니다.' });
  }
});

/**
 * 5) 삭제
 *    DELETE /defect_codes/:defect_code
 */
router.delete('/defect_codes/:defect_code', async (req, res) => {
  const code = req.params.defect_code;
  try {
    await defectService.deleteDefectCode(code);
    res.json({ message: '불량 코드가 삭제되었습니다.' });
  } catch (err) {
    console.error(`DELETE /defect_codes/${code} error:`, err);
    res.status(500).json({ error: '불량 코드 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
