// server/routers/process_router.js

const express = require('express');
const router  = express.Router();
const svc     = require('../services/process_service.js');

// 1) 조회 (전체/검색)
router.get('/processDef', async (req, res) => {
  const { searchType, searchValue } = req.query;
  try {
    const list = await svc.findProcesses(searchType, searchValue);
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '공정 조회 중 오류가 발생했습니다.' });
  }
});

// 2) 단건조회 (코드 기준)
router.get('/processDef/:code', async (req, res) => {
  try {
    const list = await svc.findProcesses('code', req.params.code);
    if (list.length === 0) return res.status(404).send({ error: '해당 공정이 없습니다.' });
    res.send(list[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '공정 단건 조회 오류' });
  }
});

// 3) 등록
router.post('/processDef', async (req, res) => {
  try {
    await svc.createProcess(req.body);
    res.status(201).send({ message: '등록 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '공정 등록 실패' });
  }
});

// 4) 수정
router.put('/processDef/:code', async (req, res) => {
  try {
    await svc.updateProcess({ process_code: req.params.code, ...req.body });
    res.send({ message: '수정 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '공정 수정 실패' });
  }
});

// 5) 삭제
router.delete('/processDef/:code', async (req, res) => {
  try {
    await svc.deleteProcess(req.params.code);
    res.send({ message: '삭제 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: '공정 삭제 실패' });
  }
});

module.exports = router;
