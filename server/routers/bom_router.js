// server/routers/bom_router.js

const express    = require('express');
const router     = express.Router();
const bomService = require('../services/bom_service.js');

/**
 * ── BOM 등록용 완제품 목록 조회 ─────────────────────
 * GET  /boms/bomitemsList
 *   - 등록 모달에서 ‘완제품(item_type=01)’만 골라 보여주기 위해 사용
 */
router.get('/boms/bomitemsList', async (req, res) => {
  try {
    const list = await bomService.bomitemsList();
    res.json(list);
  } catch (err) {
    console.error('GET /boms/bomitemsList error:', err);
    res.status(500).json({ error: '완제품 목록 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * ── BOM 마스터 ───────────────────────────────────
 */

/**
 * 1) BOM 전체 조회 또는 필터 조회
 *    GET  /boms?itemCode=ITM001
 */
router.get('/boms', async (req, res) => {
  const { itemCode = '' } = req.query;
  try {
    const list = await bomService.findBoms({ itemCode });
    res.json(list);
  } catch (err) {
    console.error('GET /boms error:', err);
    res.status(500).json({ error: 'BOM 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 2) BOM 단건 조회
 *    GET  /boms/:bomId
 */
router.get('/boms/:bomId', async (req, res) => {
  const { bomId } = req.params;
  try {
    const bom = await bomService.findBomById(bomId);
    if (!bom) {
      return res.status(404).json({ error: '해당 BOM을 찾을 수 없습니다.' });
    }
    res.json(bom);
  } catch (err) {
    console.error(`GET /boms/${bomId} error:`, err);
    res.status(500).json({ error: 'BOM 단건 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 3) BOM 생성 (bom_id, registered_date 자동 생성)
 *    POST /boms
 *    body: { item_code, item_name }
 */
router.post('/boms', async (req, res) => {
  try {
    await bomService.createBom(req.body);
    res.status(201).json({ message: 'BOM이 등록되었습니다.' });
  } catch (err) {
    console.error('POST /boms error:', err);
    res.status(500).json({ error: 'BOM 등록 중 오류가 발생했습니다.' });
  }
});

/**
 * 4) BOM 수정
 *    PUT  /boms/:bomId
 *    body: { item_code, item_name, registered_date }
 */
router.put('/boms/:bomId', async (req, res) => {
  const bom = {
    bom_id:          req.params.bomId,
    item_code:       req.body.item_code,
    item_name:       req.body.item_name,
    registered_date: req.body.registered_date
  };
  try {
    await bomService.updateBom(bom);
    res.json({ message: 'BOM이 수정되었습니다.' });
  } catch (err) {
    console.error(`PUT /boms/${bom.bom_id} error:`, err);
    res.status(500).json({ error: 'BOM 수정 중 오류가 발생했습니다.' });
  }
});

/**
 * 5) BOM 삭제
 *    DELETE /boms/:bomId
 */
router.delete('/boms/:bomId', async (req, res) => {
  const { bomId } = req.params;
  try {
    await bomService.deleteBom(bomId);
    res.json({ message: 'BOM이 삭제되었습니다.' });
  } catch (err) {
    console.error(`DELETE /boms/${bomId} error:`, err);
    res.status(500).json({ error: 'BOM 삭제 중 오류가 발생했습니다.' });
  }
});

/**
 * ── BOM 구성품 ───────────────────────────────────
 */

/**
 * 6) 특정 BOM의 구성품 전체 조회
 *    GET  /boms/:bomId/components
 */
router.get('/boms/:bomId/components', async (req, res) => {
  const { bomId } = req.params;
  try {
    const list = await bomService.findComponentsByBom(bomId);
    res.json(list);
  } catch (err) {
    console.error(`GET /boms/${bomId}/components error:`, err);
    res.status(500).json({ error: '구성품 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 7) 구성품 단건 조회
 *    GET  /boms/:bomId/components/:seqId
 */
router.get('/boms/:bomId/components/:seqId', async (req, res) => {
  const { seqId } = req.params;
  try {
    const comp = await bomService.findComponentById(seqId);
    if (!comp) {
      return res.status(404).json({ error: '해당 구성품을 찾을 수 없습니다.' });
    }
    res.json(comp);
  } catch (err) {
    console.error(`GET /boms/components/${seqId} error:`, err);
    res.status(500).json({ error: '구성품 단건 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 8) 구성품 등록
 *    POST /boms/:bomId/components
 *    body: { item_seq_id, mater_code, mater_name, mater_type, spec, unit_code, quantity, mater_id }
 */
router.post('/boms/:bomId/components', async (req, res) => {
  const comp = {
    ...req.body,
    bom_id: req.params.bomId
  };
  try {
    await bomService.createComponent(comp);
    res.status(201).json({ message: '구성품이 등록되었습니다.' });
  } catch (err) {
    console.error(`POST /boms/${comp.bom_id}/components error:`, err);
    res.status(500).json({ error: '구성품 등록 중 오류가 발생했습니다.' });
  }
});

/**
 * 9) 구성품 수정
 *    PUT  /boms/:bomId/components/:seqId
 *    body: { mater_code, mater_name, mater_type, spec, unit_code, quantity, mater_id }
 */
router.put('/boms/:bomId/components/:seqId', async (req, res) => {
  const comp = {
    ...req.body,
    item_seq_id: req.params.seqId
  };
  try {
    await bomService.updateComponent(comp);
    res.json({ message: '구성품이 수정되었습니다.' });
  } catch (err) {
    console.error(`PUT /boms/components/${comp.item_seq_id} error:`, err);
    res.status(500).json({ error: '구성품 수정 중 오류가 발생했습니다.' });
  }
});

/**
 * 10) 구성품 삭제
 *     DELETE /boms/:bomId/components/:seqId
 */
router.delete('/boms/:bomId/components/:seqId', async (req, res) => {
  const { seqId } = req.params;
  try {
    await bomService.deleteComponent(seqId);
    res.json({ message: '구성품이 삭제되었습니다.' });
  } catch (err) {
    console.error(`DELETE /boms/components/${seqId} error:`, err);
    res.status(500).json({ error: '구성품 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
