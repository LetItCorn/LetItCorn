// // server/routers/process_router.js

const express = require('express');
const router = express.Router();
const processService = require('../services/process_service.js');

/**
 * 1) 전체조회 또는 필터 조회
 *    - 쿼리 파라미터 ?code=xxx or ?name=yyy
 */
router.get('/processes', async (req, res) => {
  const { code = '', name = '' } = req.query;
  try {
    let list;
    if (code) {
      list = await processService.findProcessesByCode(code);
    } else if (name) {
      list = await processService.findProcessesByName(name);
    } else {
      list = await processService.findProcesses();
    }
    res.json(list);
  } catch (err) {
    console.error('GET /processes error', err);
    res.status(500).json({ error: '공정 목록 조회 실패' });
  }
});

/**
 * 2) 단건 조회
 *    - URL 파라미터로 process_code 사용
 */
router.get('/processes/:process_code', async (req, res) => {
  const processCode = req.params.process_code;
  try {
    const info = await processService.findProcess(processCode);
    if (!info) {
      return res.status(404).json({ error: '해당 공정을 찾을 수 없습니다.' });
    }
    res.json(info);
  } catch (err) {
    console.error(`GET /processes/${processCode} error`, err);
    res.status(500).json({ error: '공정 조회 실패' });
  }
});

/**
 * 2-1) 단위코드(공통코드 UU) 조회
 *    GET /items/unitCode
 */
router.get('/processes/unitCode', async (req, res) => {
  try {
    const unitList = await processService.unitCode();
    res.json(unitList);
  } catch (err) {
    console.error('GET /processes/unitCode error:', err);
    res.status(500).json({ error: '단위코드 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 3) 등록
 *    - body: { process_code?, process_name, duration_min, unit_code, spec }
 *    - process_code는 생략 가능 (자동 생성됨)
 */
router.post('/processes', async (req, res) => {
  const payload = req.body;
  try {
    const result = await processService.createProcess(payload);
    res.status(201).json({ message: '공정이 등록되었습니다.', result });
  } catch (err) {
    console.error('POST /processes error', err);
    res.status(500).json({ error: '공정 등록 실패' });
  }
});

/**
 * 4) 수정
 *    - body: { process_name, duration_min, unit_code, spec }
 *    - path param: process_code
 */
router.put('/processes/:process_code', async (req, res) => {
  const processCode = req.params.process_code;
  const payload = {
    ...req.body,
    process_code: processCode
  };
  try {
    const result = await processService.updateProcess(payload);
    res.json({ message: '공정이 수정되었습니다.', result });
  } catch (err) {
    console.error(`PUT /processes/${processCode} error`, err);
    res.status(500).json({ error: '공정 수정 실패' });
  }
});

/**
 * 5) 삭제
 *    - path param: process_code
 */
router.delete('/processes/:process_code', async (req, res) => {
  const processCode = req.params.process_code;
  try {
    await processService.deleteProcess(processCode);
    res.json({ message: '공정이 삭제되었습니다.' });
  } catch (err) {
    console.error(`DELETE /processes/${processCode} error`, err);
    res.status(500).json({ error: '공정 삭제 실패' });
  }
});

module.exports = router;
