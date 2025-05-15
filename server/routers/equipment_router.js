// server/routers/equipment_router.js
// ===============================================================
const express          = require('express');
const router           = express.Router();
const equipmentService = require('../services/equipment_service.js');

/*----------------------------------------------------------------
  1) 설비유형(LL) 코드
----------------------------------------------------------------*/
router.get('/equipments/typeCode', async (_, res) => {
  try { res.json(await equipmentService.getEquipmentTypeCodes()); }
  catch (err) { console.error(err); res.status(500).json({ error:'설비유형 코드 조회 오류' }); }
});

/*----------------------------------------------------------------
  2) 단위(UU) 코드
----------------------------------------------------------------*/
router.get('/equipments/unitCode', async (_, res) => {
  try { res.json(await equipmentService.getUnitCodes()); }
  catch (err) { console.error(err); res.status(500).json({ error:'단위코드 조회 오류' }); }
});

/*----------------------------------------------------------------
  ⭐️ 2-1) 적합여부(DD) 코드 – 신설
----------------------------------------------------------------*/
router.get('/equipments/suitableCode', async (_, res) => {
  try { res.json(await equipmentService.getSuitableCodes()); }
  catch (err) { console.error(err); res.status(500).json({ error:'적합여부 코드 조회 오류' }); }
});

/**
 * 3) 설비점검 이력 조회 (특정 설비)
 *    GET /equipments/inspectionsList/:equipment_code
 */
router.get('/equipments/inspectionsList/:equipment_code', async (req, res) => {
  try {
    const list = await equipmentService.equipmentInspectionsList(
      req.params.equipment_code
    );
    res.json(list);
  } catch (err) {
    console.error(`GET /equipments/inspectionsList/${req.params.equipment_code} error:`, err);
    res.status(500).json({ error: '설비점검 이력 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 4) 설비점검 이력 저장 (MERGE)
 *    POST /equipments/saveInspection
 *    body: { inspection_id?, inspection_date, inspector_id,
 *            contents, result, equipment_code }
 */
router.post('/equipments/saveInspection', async (req, res) => {
  try {
    // 서비스에서 inspection_id를 돌려받음
    const nextId = await equipmentService.saveInspection(req.body);
    // ⭐ { next_id } 형태로 응답
    res.json({ next_id: nextId });
  } catch (err) {
    console.error('POST /equipments/saveInspection error:', err);
    res.status(500).json({ error: '설비점검 이력 저장 중 오류가 발생했습니다.' });
  }
});

/**
 * 5) 설비점검 이력 삭제
 *    POST /equipments/deleteInspection
 *    body: { inspection_id }
 */
router.post('/equipments/deleteInspection', async (req, res) => {
  try {
    const result = await equipmentService.deleteInspection(req.body.inspection_id);
    res.json(result);
  } catch (err) {
    console.error('POST /equipments/deleteInspection error:', err);
    res.status(500).json({ error: '설비점검 이력 삭제 중 오류가 발생했습니다.' });
  }
});

/**
 * 6) 설비 전체조회 + 조건검색
 *    GET /equipments?code=xxx&name=yyy&type=zzz
 */
router.get('/equipments', async (req, res) => {
  try {
    const { code = '', name = '', type = '' } = req.query;
    const list = await equipmentService.findEquipments({ code, name, type });
    res.json(list);
  } catch (err) {
    console.error('GET /equipments error:', err);
    res.status(500).json({ error: '설비 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 7) 설비 단건조회
 *    GET /equipments/:equipment_code
 */
router.get('/equipments/:equipment_code', async (req, res) => {
  try {
    const info = await equipmentService.findEquipment(req.params.equipment_code);
    if (!info) {
      return res.status(404).json({ error: '해당 설비를 찾을 수 없습니다.' });
    }
    res.json(info);
  } catch (err) {
    console.error(`GET /equipments/${req.params.equipment_code} error:`, err);
    res.status(500).json({ error: '설비 단건 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 8) 설비 등록/수정 (MERGE)
 *    POST /equipments
 *    body: { equipment_code?, equipment_name, equipment_type,
 *            install_date, manufacturer, next_inspection_dt,
 *            is_suitable, unit_code, qty }
 */
router.post('/equipments', async (req, res) => {
  try {
    const result = await equipmentService.saveEquipment(req.body);
    res.json(result);
  } catch (err) {
    console.error('POST /equipments error:', err);
    res.status(500).json({ error: '설비 저장 중 오류가 발생했습니다.' });
  }
});

/**
 * 9) 설비 삭제
 *    DELETE /equipments/:equipment_code
 */
router.delete('/equipments/:equipment_code', async (req, res) => {
  try {
    const result = await equipmentService.deleteEquipment(req.params.equipment_code);
    res.json(result);
  } catch (err) {
    console.error(`DELETE /equipments/${req.params.equipment_code} error:`, err);
    res.status(500).json({ error: '설비 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
