// server/routers/defect_codes_router.js
const express = require('express');
const router  = express.Router();
const svc     = require('../services/defect_codes_service.js');

// 1) 전체 조회 또는 검색
// GET /defect_codes?searchType=code|type|used&searchValue=...
router.get('/defect_codes', async (req, res) => {
  const { searchType, searchValue } = req.query;
  try {
    const list = await svc.findDefectCodes(searchType, searchValue);
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '불량코드 조회 중 오류가 발생했습니다.' });
  }
});

// 2) 단건 조회 (코드 기준)
// GET /defect_codes/:code
router.get('/defect_codes/:code', async (req, res) => {
  try {
    const list = await svc.findDefectCodes('code', req.params.code);
    if (!list.length) return res.status(404).send({ error: '해당 불량코드가 없습니다.' });
    res.send(list[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '불량코드 단건 조회 오류' });
  }
});

// 3) 등록
// POST /defect_codes
// body: { defect_code, defect_type, is_used, created_date }
router.post('/defect_codes', async (req, res) => {
  try {
    await svc.createDefectCode(req.body);
    res.status(201).send({ message: '등록 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '불량코드 등록 실패' });
  }
});

// 4) 수정
// PUT /defect_codes/:code
// body: { defect_type, is_used }
router.put('/defect_codes/:code', async (req, res) => {
  try {
    await svc.updateDefectCode({ defect_code: req.params.code, ...req.body });
    res.send({ message: '수정 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '불량코드 수정 실패' });
  }
});

// 5) 삭제
// DELETE /defect_codes/:code
router.delete('/defect_codes/:code', async (req, res) => {
  try {
    await svc.deleteDefectCode(req.params.code);
    res.send({ message: '삭제 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '불량코드 삭제 실패' });
  }
});

module.exports = router;
