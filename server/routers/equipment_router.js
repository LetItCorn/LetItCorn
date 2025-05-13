const express = require('express');
const router = express.Router();
const svc = require('../services/equipment_service.js');

/**
 * 1) 장비 목록 조회
 *    GET /api/equipments?code=&name=&type=&manu=
 */
router.get('/equipments', async (req, res) => {
  const { code = '', name = '', type = '', manu = '' } = req.query;
  try {
    const list = await svc.findEquipments({ code, name, type, manu });
    res.json(list);
  } catch (err) {
    console.error('GET /equipments error:', err);
    res.status(500).json({ error: '장비 목록 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 2) 장비 단건 조회
 *    GET /api/equipments/:equipment_code
 */
router.get('/equipments/:equipment_code', async (req, res) => {
  const code = req.params.equipment_code;
  try {
    const eq = await svc.findEquipmentByCode(code);
    if (!eq) return res.status(404).json({ error: '해당 장비를 찾을 수 없습니다.' });
    res.json(eq);
  } catch (err) {
    console.error(`GET /equipments/${code} error:`, err);
    res.status(500).json({ error: '장비 단건 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 3) 장비 등록 또는 수정 (MERGE 방식)
 *    POST /api/equipments
 */
router.post('/equipments', async (req, res) => {
  try {
    await svc.saveEquipment(req.body);
    res.status(201).json({ message: '장비가 등록/수정되었습니다.' });
  } catch (err) {
    console.error('POST /equipments error:', err);
    res.status(500).json({ error: '장비 저장 중 오류가 발생했습니다.' });
  }
});

/**
 * 4) 장비 삭제
 *    DELETE /api/equipments/:equipment_code
 */
router.delete('/equipments/:equipment_code', async (req, res) => {
  const code = req.params.equipment_code;
  try {
    await svc.deleteEquipment(code);
    res.json({ message: '장비가 삭제되었습니다.' });
  } catch (err) {
    console.error(`DELETE /equipments/${code} error:`, err);
    res.status(500).json({ error: '장비 삭제 중 오류가 발생했습니다.' });
  }
});

/**
 * 5) 점검 이력 목록 조회 (장비 클릭 시)
 *    GET /api/equipment_inspections/:equipment_code
 */
router.get('/equipment_inspections/:equipment_code', async (req, res) => {
  const code = req.params.equipment_code;
  try {
    const list = await svc.findInspectionsByEquipment(code);
    res.json(list);
  } catch (err) {
    console.error(`GET /equipment_inspections/${code} error:`, err);
    res.status(500).json({ error: '점검 이력 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 6) 점검 이력 단건 조회 (선택 후 수정용)
 *    GET /api/equipment_inspections/inspection/:inspection_id
 */
router.get('/equipment_inspections/inspection/:inspection_id', async (req, res) => {
  const id = req.params.inspection_id;
  try {
    const ins = await svc.findInspectionById(id);
    if (!ins) return res.status(404).json({ error: '해당 점검 이력을 찾을 수 없습니다.' });
    res.json(ins);
  } catch (err) {
    console.error(`GET /equipment_inspections/inspection/${id} error:`, err);
    res.status(500).json({ error: '점검 이력 단건 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * 7) 점검 이력 등록 또는 수정 (MERGE 방식)
 *    POST /api/equipment_inspections
 */
router.post('/equipment_inspections', async (req, res) => {
  try {
    await svc.saveInspection(req.body);
    res.status(201).json({ message: '점검 이력이 등록/수정되었습니다.' });
  } catch (err) {
    console.error('POST /equipment_inspections error:', err);
    res.status(500).json({ error: '점검 이력 저장 중 오류가 발생했습니다.' });
  }
});

/**
 * 8) 점검 이력 삭제
 *    DELETE /api/equipment_inspections/:inspection_id
 */
router.delete('/equipment_inspections/:inspection_id', async (req, res) => {
  const id = req.params.inspection_id;
  try {
    await svc.deleteInspection(id);
    res.json({ message: '점검 이력이 삭제되었습니다.' });
  } catch (err) {
    console.error(`DELETE /equipment_inspections/${id} error:`, err);
    res.status(500).json({ error: '점검 이력 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
