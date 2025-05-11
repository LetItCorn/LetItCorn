// server/routers/process_router.js

const express = require('express');
const router = express.Router();
const processService = require('../services/process_service.js');

/**
 * 1) 전체조회 혹은 필터 조회
 *    - 쿼리 파라미터 code, name 기반으로 LIKE 검색
 *    - 없으면 전체조회
 */
router.get('/processes', async (req, res) => {
  const { code = '', name = '' } = req.query;  // 필터 파라미터 추출
  try {
    let list;
    if (code) {
      // 공정코드 일부 검색
      list = await processService.findProcessesByCode(code);
    } else if (name) {
      // 공정명 일부 검색
      list = await processService.findProcessesByName(name);
    } else {
      // 전체 공정 목록 조회
      list = await processService.findProcesses();
    }
    res.json(list);
  } catch (err) {
    console.error('GET /processes error', err);
    res.status(500).json({ error: '서버 오류' });
  }
});

/**
 * 2) 단건조회 (정확 일치 검색)
 *    - URL 파라미터 process_code 사용
 */
router.get('/processes/:process_code', async (req, res) => {
  const processCode = req.params.process_code;  // 경로 파라미터 추출
  try {
    const info = await processService.findProcess(processCode);
    if (!info) {
      // 해당 코드의 공정이 없을 경우
      return res.status(404).json({ error: '해당 공정이 없습니다.' });
    }
    res.json(info);
  } catch (err) {
    console.error(`GET /processes/${processCode} error`, err);
    res.status(500).json({ error: '서버 오류' });
  }
});

/**
 * 3) 등록
 *    - 요청 바디에 공정 정보(process_code, process_header, process_name, duration_min) 포함
 */
router.post('/processes', async (req, res) => {
  
  const payload = req.body;  // 새 공정 데이터
  try {
    const result = await processService.createProcess(payload);
    res.status(201).json(result);
  } catch (err) {
    console.error('POST /processes error', err);
    res.status(500).json({ error: '등록 실패' });
  }
});

/**
 * 4) 수정
 *    - URL 파라미터 process_code 및 요청 바디(process_header, process_name, duration_min)
 */
router.put('/processes/:process_code', async (req, res) => {
  const processCode = req.params.process_code;
  const payload = { ...req.body, process_code: processCode };  // 수정 데이터에 코드 병합
  try {
    const result = await processService.updateProcess(payload);
    res.json(result);
  } catch (err) {
    console.error(`PUT /processes/${processCode} error`, err);
    res.status(500).json({ error: '수정 실패' });
  }
});

/**
 * 5) 삭제
 *    - URL 파라미터 process_code로 대상 공정 삭제
 */
router.delete('/processes/:process_code', async (req, res) => {
  const processCode = req.params.process_code;
  try {
    const result = await processService.deleteProcess(processCode);
    res.json(result);
  } catch (err) {
    console.error(`DELETE /processes/${processCode} error`, err);
    res.status(500).json({ error: '삭제 실패' });
  }
});

module.exports = router;
