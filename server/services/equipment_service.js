// server/services/equipment_service.js

const mapper = require('../database/mapper.js');

//
// ─── Equipment Master Services ────────────────────────────
//

/**
 * 장비 목록 전체 조회 (검색 필터 포함)
 */
async function findEquipments({ code = '', name = '', type = '', manu = '' } = {}) {
  try {
    return await mapper.query('equipmentList', [
      code, code,       // LIKE 조건: equipment_code
      name, name,       // LIKE 조건: equipment_name
      type, type,       // 정확 일치: equipment_type
      manu, manu        // LIKE 조건: manufacturer
    ]);
  } catch (err) {
    console.error('findEquipments error:', err);
    return [];
  }
}

/**
 * 장비 단건 조회
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
 * 다음 장비코드 자동 생성 (EQ0001 → EQ0002)
 */
async function generateNextEquipmentCode() {
  try {
    const rows = await mapper.query('equipmentNextCode');
    return rows[0]?.next_code;
  } catch (err) {
    console.error('generateNextEquipmentCode error:', err);
    throw err;
  }
}

/**
 * 장비 저장 (등록 또는 수정 - MERGE 방식)
 * 코드가 없으면 자동 생성
 */
async function saveEquipment(eq) {
  try {
    // equipment_code가 비어 있으면 새 코드 생성
    if (!eq.equipment_code) {
      eq.equipment_code = await generateNextEquipmentCode();
    }

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

    return await mapper.query('equipmentMerge', params);
  } catch (err) {
    console.error('saveEquipment (MERGE) error:', err);
    throw err;
  }
}

/**
 * 장비 삭제
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
 * 점검 이력 단건 조회
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
 * 다음 점검 ID 자동 생성 (IN0001 → IN0002)
 */
async function generateNextInspectionId() {
  try {
    const rows = await mapper.query('inspectionNextId');
    return rows[0]?.next_id;
  } catch (err) {
    console.error('generateNextInspectionId error:', err);
    throw err;
  }
}

/**
 * 점검 이력 저장 (등록 또는 수정 - MERGE 방식)
 * ID가 없으면 자동 생성
 */
async function saveInspection(ins) {
  try {
    // inspection_id가 비어 있으면 새 ID 생성
    if (!ins.inspection_id) {
      ins.inspection_id = await generateNextInspectionId();
    }

    const params = [
      ins.inspection_id,
      ins.inspection_date,
      ins.inspector_id,
      ins.contents,
      ins.result,
      ins.equipment_code
    ];

    return await mapper.query('inspectionMerge', params);
  } catch (err) {
    console.error('saveInspection (MERGE) error:', err);
    throw err;
  }
}

/**
 * 점검 이력 삭제
 */
async function deleteInspection(id) {
  try {
    return await mapper.query('inspectionDelete', [id]);
  } catch (err) {
    console.error('deleteInspection error:', err);
    throw err;
  }
}

//
// ─── Export ─────────────────────────────
//
module.exports = {
  // 장비
  findEquipments,
  findEquipmentByCode,
  saveEquipment,
  deleteEquipment,

  // 점검
  findInspectionsByEquipment,
  findInspectionById,
  saveInspection,
  deleteInspection
};
