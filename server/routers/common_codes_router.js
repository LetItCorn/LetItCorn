// server/routers/common_codes_router.js
const express = require('express');
const router  = express.Router();
const svc     = require('../services/common_codes_service.js');

// 1) 전체 조회 또는 검색
// GET /common_codes?searchType=group|value|name|used&searchValue=...
router.get('/common_codes', async (req, res) => {
  const { searchType, searchValue } = req.query;
  try {
    const list = await svc.findCommonCodes(searchType, searchValue);
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '공통코드 조회 중 오류가 발생했습니다.' });
  }
});

// 2) 단건 조회 (group+value 기준)
// GET /common_codes/:group/:value
router.get('/common_codes/:group/:value', async (req, res) => {
  const { group, value } = req.params;
  try {
    const list = await svc.findCommonCodes('one', [group, value]);
    if (!list.length) return res.status(404).send({ error: '해당 공통코드가 없습니다.' });
    res.send(list[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '공통코드 단건 조회 오류' });
  }
});

// 3) 등록
// POST /common_codes
// body: { code_group, code_value, code_name, use_yn, comm_etc }
router.post('/common_codes', async (req, res) => {
  try {
    await svc.createCommonCode(req.body);
    res.status(201).send({ message: '등록 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '공통코드 등록 실패' });
  }
});

// 4) 수정
// PUT /common_codes/:group/:value
// body: { code_name, use_yn, comm_etc }
router.put('/common_codes/:group/:value', async (req, res) => {
  const { group, value } = req.params;
  try {
    await svc.updateCommonCode({ code_group: group, code_value: value, ...req.body });
    res.send({ message: '수정 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '공통코드 수정 실패' });
  }
});

// 5) 삭제
// DELETE /common_codes/:group/:value
router.delete('/common_codes/:group/:value', async (req, res) => {
  const { group, value } = req.params;
  try {
    await svc.deleteCommonCode(group, value);
    res.send({ message: '삭제 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '공통코드 삭제 실패' });
  }
});

module.exports = router;
