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
 * 2-a) 단건조회 (code_group + code_rear 기준)
 *    GET /common_codes/:group/:rear
 */
router.get('/common_codes/:group/:rear', async (req, res) => {
  const { group, rear } = req.params;
  try {
    const info = await commonService.findCommonCode(group, rear);
    if (!info) {
      return res.status(404).json({ error: '해당 공통 코드를 찾을 수 없습니다.' });
    }
    res.json(info);
  } catch (err) {
    console.error(`GET /common_codes/${group}/${rear} error:`, err);
    res.status(500).json({ error: '단건 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 2-b) 단건조회 (code_values 기준)
 *    GET /common_codes/value/:codeValue
 */
router.get('/common_codes/value/:codeValue', async (req, res) => {
  const { codeValue } = req.params;
  try {
    const info = await commonService.findCommonCodeByValue(codeValue);
    if (!info) {
      return res.status(404).json({ error: '해당 코드값을 찾을 수 없습니다.' });
    }
    res.json(info);
  } catch (err) {
    console.error(`GET /common_codes/value/${codeValue} error:`, err);
    res.status(500).json({ error: '코드값 기준 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 2-c) 다음 code_rear 자동 생성용
 *    GET /common_codes/nextRear/:group
 */
router.get('/common_codes/nextRear/:group', async (req, res) => {
  const group = req.params.group;
  try {
    const nextRear = await commonService.getNextCodeRear(group);
    if (!nextRear) {
      return res.status(404).json({ error: '다음 하위코드를 생성할 수 없습니다.' });
    }
    res.json({ next_rear: nextRear });
  } catch (err) {
    console.error(`GET /common_codes/nextRear/${group} error:`, err);
    res.status(500).json({ error: '다음 코드 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 3/4) 등록 또는 수정 (UPSERT)
 *    POST /common_codes
 *    body: { code_group, code_rear, code_name, use_yn, comm_etc, code_values }
 */
router.post('/common_codes', async (req, res) => {
  try {
    await commonService.saveCommonCode(req.body);
    res.status(200).json({ message: '공통 코드가 저장되었습니다.' });
  } catch (err) {
    console.error('POST /common_codes error:', err);
    res.status(500).json({ error: '저장 중 오류가 발생했습니다.' });
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
