// server/routers/item_router.js

const express     = require('express');
const router      = express.Router();
const itemService = require('../services/item_service.js');

/**
 * 1) 전체 공정 목록 조회
 *    GET /items/processesList
 */
router.get('/items/processesList', async (req, res) => {
  try {
    const list = await itemService.processesList();
    res.json(list);
  } catch (err) {
    console.error('GET /items/processesList error:', err);
    res.status(500).json({ error: '공정 목록 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 2) 품목구분(공통코드 CC) 조회
 *    GET /items/itemCode
 */
router.get('/items/itemCode', async (req, res) => {
  try {
    const codeList = await itemService.itemCode();
    res.json(codeList);
  } catch (err) {
    console.error('GET /items/itemCode error:', err);
    res.status(500).json({ error: '품목구분 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 3) 단위코드(공통코드 UU) 조회
 *    GET /items/unitCode
 */
router.get('/items/unitCode', async (req, res) => {
  try {
    const unitList = await itemService.unitCode();
    res.json(unitList);
  } catch (err) {
    console.error('GET /items/unitCode error:', err);
    res.status(500).json({ error: '단위코드 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 4) 공정 흐름 저장
 *    POST /items/saveProcessFlows
 *    body: { flows: Array<{ process_code, sequence_order, item_code }> }
 */
router.post('/items/saveProcessFlows', async (req, res) => {
  try {
    const flows = req.body.flows;
    const result = await itemService.saveProcessFlows(flows);
    res.json(result);
  } catch (err) {
    console.error('POST /items/saveProcessFlows error:', err);
    res.status(500).json({ error: '공정 흐름 저장 중 오류가 발생했습니다.' });
  }
});

/**
 * 5) 공정 흐름 삭제
 *    POST /items/deleteProcessItem
 *    body: { process_header, item_code, sequence_order }
 */
router.post('/items/deleteProcessItem', async (req, res) => {
  try {
    const payload = req.body;
    const result = await itemService.deleteProcessItem(payload);
    res.json(result);
  } catch (err) {
    console.error('POST /items/deleteProcessItem error:', err);
    res.status(500).json({ error: '공정 흐름 삭제 중 오류가 발생했습니다.' });
  }
});

/**
 * 6) 품목 전체조회 + 조건검색
 *    GET /items?code=xxx&name=yyy&type=zzz
 */
router.get('/items', async (req, res) => {
  try {
    const { code = '', name = '', type = '' } = req.query;
    const list = await itemService.findItems({ code, name, type });
    res.json(list);
  } catch (err) {
    console.error('GET /items error:', err);
    res.status(500).json({ error: '품목 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 7) 품목 단건조회
 *    GET /items/:item_code
 */
router.get('/items/:item_code', async (req, res) => {
  try {
    const itemCode = req.params.item_code;
    const info = await itemService.findByItem(itemCode);
    if (!info) {
      return res.status(404).json({ error: '해당 품목을 찾을 수 없습니다.' });
    }
    res.json(info);
  } catch (err) {
    console.error(`GET /items/${req.params.item_code} error:`, err);
    res.status(500).json({ error: '품목 단건 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 8) 품목 등록/수정 (MERGE)
 *    POST /items
 *    body: { item_code, item_name, item_type, unit_code, spec, qty }
 */
router.post('/items', async (req, res) => {
  try {
    const payload = req.body;
    const result = await itemService.saveItem(payload);
    res.json(result);
  } catch (err) {
    console.error('POST /items error:', err);
    res.status(500).json({ error: '품목 저장 중 오류가 발생했습니다.' });
  }
});

/**
 * 9) 품목 삭제
 *    DELETE /items/:item_code
 */
router.delete('/items/:item_code', async (req, res) => {
  try {
    const itemCode = req.params.item_code;
    const result = await itemService.deleteItem(itemCode);
    res.json(result);
  } catch (err) {
    console.error(`DELETE /items/${req.params.item_code} error:`, err);
    res.status(500).json({ error: '품목 삭제 중 오류가 발생했습니다.' });
  }
});

/**
 * 10) 특정 품목의 공정 흐름 조회
 *     GET /items/itemProcessFlowsList/:item_code
 */
router.get('/items/itemProcessFlowsList/:item_code', async (req, res) => {
  try {
    const itemCode = req.params.item_code;
    const list = await itemService.itemProcessFlowsList(itemCode);
    res.json(list);
  } catch (err) {
    console.error(`GET /items/itemProcessFlowsList/${req.params.item_code} error:`, err);
    res.status(500).json({ error: '공정 흐름 조회 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
