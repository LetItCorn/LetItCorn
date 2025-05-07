// server/routers/common_codes_router.js

const express = require('express');
const router = express.Router();
const commonService = require('../services/common_codes_service.js');

/**
 * 1) 전체조회 + 필터 검색
 *    GET /common_codes?group=AA&rear=01&name=관리&useYn=Y
 */
router.get('/common_codes', async (req, res) => {
  const { group = '', rear = '', name = '', useYn = '' } = req.query;
  try {
    const list = await commonService.findCommonCodes({ group, rear, name, useYn });
    res.json(list);
  } catch (err) {
    console.error('GET /common_codes error:', err);
    res.status(500).json({ error: '공통 코드 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 1-a) 그룹별 조회
 *    GET /common_codes/group/:group
 */
router.get('/common_codes/group/:group', async (req, res) => {
  const group = req.params.group;
  try {
    const list = await commonService.findCommonCodesByGroup(group);
    res.json(list);
  } catch (err) {
    console.error(`GET /common_codes/group/${group} error:`, err);
    res.status(500).json({ error: '그룹별 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 1-b) 하위코드별 조회
 *    GET /common_codes/rear/:rear
 */
router.get('/common_codes/rear/:rear', async (req, res) => {
  const rear = req.params.rear;
  try {
    const list = await commonService.findCommonCodesByRear(rear);
    res.json(list);
  } catch (err) {
    console.error(`GET /common_codes/rear/${rear} error:`, err);
    res.status(500).json({ error: '하위 코드별 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 1-c) 명칭으로 조회 (LIKE 검색)
 *    GET /common_codes/name/:name
 */
router.get('/common_codes/name/:name', async (req, res) => {
  const name = req.params.name;
  try {
    const list = await commonService.findCommonCodesByName(name);
    res.json(list);
  } catch (err) {
    console.error(`GET /common_codes/name/${name} error:`, err);
    res.status(500).json({ error: '명칭별 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 1-d) 사용여부별 조회
 *    GET /common_codes/useYn/:useYn
 */
router.get('/common_codes/useYn/:useYn', async (req, res) => {
  const useYn = req.params.useYn;
  try {
    const list = await commonService.findCommonCodesByUseYn(useYn);
    res.json(list);
  } catch (err) {
    console.error(`GET /common_codes/useYn/${useYn} error:`, err);
    res.status(500).json({ error: '사용여부별 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 2) 단건조회
 *    GET /common_codes/:group/:rear
 */
router.get('/common_codes/:group/:rear', async (req, res) => {
  const { group, rear } = req.params;
  try {
    const info = await commonService.findCommonCode(group, rear);
    if (!info) return res.status(404).json({ error: '해당 공통 코드를 찾을 수 없습니다.' });
    res.json(info);
  } catch (err) {
    console.error(`GET /common_codes/${group}/${rear} error:`, err);
    res.status(500).json({ error: '단건 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 3) 등록
 *    POST /common_codes
 *    body: { code_group, code_rear, code_name, use_yn, comm_etc, code_values }
 */
router.post('/common_codes', async (req, res) => {
  try {
    await commonService.createCommonCode(req.body);
    res.status(201).json({ message: '공통 코드가 등록되었습니다.' });
  } catch (err) {
    console.error('POST /common_codes error:', err);
    res.status(500).json({ error: '등록 중 오류가 발생했습니다.' });
  }
});

/**
 * 4) 수정
 *    PUT /common_codes/:group/:rear
 *    body: { code_name, use_yn, comm_etc, code_values }
 */
router.put('/common_codes/:group/:rear', async (req, res) => {
  const { group, rear } = req.params;
  const payload = { ...req.body, code_group: group, code_rear: rear };
  try {
    await commonService.updateCommonCode(payload);
    res.json({ message: '공통 코드가 수정되었습니다.' });
  } catch (err) {
    console.error(`PUT /common_codes/${group}/${rear} error:`, err);
    res.status(500).json({ error: '수정 중 오류가 발생했습니다.' });
  }
});

/**
 * 5) 삭제
 *    DELETE /common_codes/:group/:rear
 */
router.delete('/common_codes/:group/:rear', async (req, res) => {
  const { group, rear } = req.params;
  try {
    await commonService.deleteCommonCode(group, rear);
    res.json({ message: '공통 코드가 삭제되었습니다.' });
  } catch (err) {
    console.error(`DELETE /common_codes/${group}/${rear} error:`, err);
    res.status(500).json({ error: '삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
