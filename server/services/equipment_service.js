// server/services/equipment_service.js

const mapper = require('../database/mapper.js');

//
// ─── Equipment Master Services ────────────────────────────
//

/**
 * 전체 조회 (+ 옵션 검색)
 * @param {object} filters
 * @param {string} filters.code  장비코드 필터 (LIKE)
 * @param {string} filters.name  장비명 필터 (LIKE)
 * @param {string} filters.type  장비유형 필터 (정확)
 * @param {string} filters.manu  제조사 필터 (LIKE)
 */
async function findEquipments({ code = '', name = '', type = '', manu = '' } = {}) {
  try {
    return await mapper.query('equipmentList', [
      code, code,
      name, name,
      type, type,
      manu, manu
    ]);
  } catch (err) {
    console.error('findEquipments error:', err);
    return [];
  }
}

/**
 * 단건 조회 (equipment_code 기준)
 * @param {string} code
 * @returns {Promise<Object|null>}
 */
async function findEquipmentByCode(code) {
  try {
    const rows = await mapper.query('equipmentInfo', [code]);
    return rows[0] || null;
  } catch (err) {
    console.error('findEquipmentByCode error:', err);
    return null;
  }
}

/**
 * 등록
 * @param {object} eq
 */
async function createEquipment(eq) {
  const params = [
    eq.equipment_code,
    eq.equipment_name,
    eq.equipment_type,
    eq.install_date,
    eq.manufacturer,
    eq.capacity,
    eq.next_inspection_dt,
    eq.is_suitable
  ];
  try {
    return await mapper.query('equipmentInsert', params);
  } catch (err) {
    console.error('createEquipment error:', err);
    throw err;
  }
}

/**
 * 수정
 * @param {object} eq
 */
async function updateEquipment(eq) {
  const params = [
    eq.equipment_name,
    eq.equipment_type,
    eq.install_date,
    eq.manufacturer,
    eq.capacity,
    eq.next_inspection_dt,
    eq.is_suitable,
    eq.equipment_code
  ];
  try {
    return await mapper.query('equipmentUpdate', params);
  } catch (err) {
    console.error('updateEquipment error:', err);
    throw err;
  }
}

/**
 * 삭제
 * @param {string} code
 */
async function deleteEquipment(code) {
  try {
    return await mapper.query('equipmentDelete', [code]);
  } catch (err) {
    console.error('deleteEquipment error:', err);
    throw err;
  }
}

//
// ─── Inspection History Services ────────────────────────────
//

/**
 * 특정 장비의 점검 이력 전체 조회
 * @param {string} equipmentCode
 */
async function findInspectionsByEquipment(equipmentCode) {
  try {
    return await mapper.query('inspectionList', [equipmentCode]);
  } catch (err) {
    console.error('findInspectionsByEquipment error:', err);
    return [];
  }
}

/**
 * 단건 조회 (inspection_id 기준)
 * @param {string} id
 */
async function findInspectionById(id) {
  try {
    const rows = await mapper.query('inspectionInfo', [id]);
    return rows[0] || null;
  } catch (err) {
    console.error('findInspectionById error:', err);
    return null;
  }
}

/**
 * 점검 이력 등록
 * @param {object} ins
 */
async function createInspection(ins) {
  const params = [
    ins.inspection_id,
    ins.inspection_date,
    ins.inspector_id,
    ins.contents,
    ins.result,
    ins.equipment_code
  ];
  try {
    return await mapper.query('inspectionInsert', params);
  } catch (err) {
    console.error('createInspection error:', err);
    throw err;
  }
}

/**
 * 점검 이력 수정
 * @param {object} ins
 */
async function updateInspection(ins) {
  const params = [
    ins.inspection_date,
    ins.inspector_id,
    ins.contents,
    ins.result,
    ins.inspection_id
  ];
  try {
    return await mapper.query('inspectionUpdate', params);
  } catch (err) {
    console.error('updateInspection error:', err);
    throw err;
  }
}

/**
 * 점검 이력 삭제
 * @param {string} id
 */
async function deleteInspection(id) {
  try {
    return await mapper.query('inspectionDelete', [id]);
  } catch (err) {
    console.error('deleteInspection error:', err);
    throw err;
  }
}

module.exports = {
  // equipments
  findEquipments,
  findEquipmentByCode,
  createEquipment,
  updateEquipment,
  deleteEquipment,

  // equipment_inspections
  findInspectionsByEquipment,
  findInspectionById,
  createInspection,
  updateInspection,
  deleteInspection
};
