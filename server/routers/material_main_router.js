// server/routers/material_main_router.js
const express = require('express');
const router = express.Router();
const materialService = require('../services/material_main_service.js');

/**
 * 1) 전체 조회 또는 조건 검색
 *    - 쿼리 파라미터 code, name을 기준으로 검색
 *    - 모두 비어 있으면 전체 목록 조회
 */
router.get('/materialmains', async (req, res) => {
  const { code = '', name = '' } = req.query;
  try {
    const list = await materialService.findMaterials({ code, name });
    res.json(list);
  } catch (err) {
    console.error('GET /materialmains error', err);
    res.status(500).json({ error: '자재 목록 조회 중 오류 발생' });
  }
});

// 단위코드(공통코드 UU) 가져오기
router.get('/materialmains/unitCode', async (req, res) => {
  try {
    const unitList = await materialService.unitCode();
    res.json(unitList);
  } catch (err) {
    console.error('GET / materialmains/unitCode error:', err);
    res.status(500).json({ error: '단위코드 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 2) 단건 조회
 *    - URL 파라미터 mater_code로 조회
 */
router.get('/materialmains/:mater_code', async (req, res) => {
  const materCode = req.params.mater_code;
  try {
    const info = await materialService.MaterialByCode(materCode);
    if (!info) {
      return res.status(404).json({ error: '해당 자재가 존재하지 않습니다.' });
    }
    res.json(info);
  } catch (err) {
    console.error(`GET /materialmains/${materCode} error`, err);
    res.status(500).json({ error: '자재 조회 중 오류 발생' });
  }
});

/**
 * 3) 등록 또는 수정
 *    - 요청 바디에 자재 정보 포함
 *    - mater_code로 MERGE 수행
 */
router.post('/materialmains', async (req, res) => {
  const payload = req.body;
  try {
    const result = await materialService.saveMaterial(payload);
    res.status(201).json(result);
  } catch (err) {
    console.error('POST /materials error', err);
    res.status(500).json({ error: '자재 저장 실패' });
  }
});

/**
 * 4) 삭제
 *    - URL 파라미터 mater_code로 자재 삭제
 */
router.delete('/materialmains/:mater_code', async (req, res) => {
  const materCode = req.params.mater_code;
  try {
    const result = await materialService.deleteMaterial(materCode);
    res.json(result);
  } catch (err) {
    console.error(`DELETE /materialmains/${materCode} error`, err);
    res.status(500).json({ error: '자재 삭제 실패' });
  }
});

module.exports = router;