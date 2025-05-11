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

// 품목구분 가져오기
router.get('/items/itemCode', async (req, res) => {
  try {
    const code = await itemService.itemCode();
    res.json(code);
  }catch (err) {
    console.error('GET /items/itemCode error:', err);
    res.status(500).json({error: '공정 목록 조회 중 오류가 발생했습니다.'});
  }
});

// 단위코드 가져오기
router.get('/items/unitCode', async (req, res) => {
  try {
    const code = await itemService.unitCode();
    res.json(code);
  }catch (err) {
    console.error('GET /items/itemCode error:', err);
    res.status(500).json({error: '공정 목록 조회 중 오류가 발생했습니다.'});
  }
});

/**
 * 2) 공정 흐름 저장
 *    POST /saveProcessFlows
 *    body: { flows: Array<{ item_code, process_header, sequence_order, duration }> }
 */
router.post('/saveProcessFlows', async (req, res) => {
  try {
    const flows = req.body.flows;
    const result = await itemService.saveProcessFlows(flows);
    res.json(result);
  } catch (err) {
    console.error('POST /saveProcessFlows error:', err);
    res.status(500).json({ error: '공정 흐름 저장 중 오류가 발생했습니다.' });
  }
});

/**
 * 3) 공정 흐름 삭제
 *    POST /items/deleteProcessItem
 *    body: { item_code, process_header, sequence_order }
 */
router.post('/items/deleteProcessItem', async (req, res) => {
  try {
    const result = await itemService.deleteProcessItem(req.body);
    res.json(result);
  } catch (err) {
    console.error('POST /items/deleteProcessItem error:', err);
    res.status(500).json({ error: '공정 흐름 삭제 중 오류가 발생했습니다.' });
  }
});

/**
 * 4) 품목 전체조회 + 조건검색
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
 * 5) 품목 단건조회
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
 * 6) 품목 등록/수정 (MERGE)
 *    POST /items
 *    body: { item_code, item_name, item_type, unit_code, spec, qty }
 */
router.post('/items', async (req, res) => {
  try {
    const result = await itemService.saveItem(req.body);
    res.json(result);
  } catch (err) {
    console.error('POST /items error:', err);
    res.status(500).json({ error: '품목 저장 중 오류가 발생했습니다.' });
  }
});

/**
 * 7) 품목 삭제
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
 * 8) 특정 품목의 공정 흐름 조회
 *    GET /items/itemProcessFlowsList/:item_code
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
