// server/services/equipment_service.js
// -------------------------------------------------------------
//   설비 + 설비점검이력 서비스 모듈 (item_service 패턴 준용)
// -------------------------------------------------------------
const mariaDB = require('../database/mapper.js');

/*--------------------------------------------------------------
  0) 공통코드 헬퍼
--------------------------------------------------------------*/
// 설비유형(LL)
const getEquipmentTypeCodes = async () => {
  try { return await mariaDB.query('equipmentTypeCode'); }
  catch (err) { console.error('getEquipmentTypeCodes error', err); return []; }
};

// 단위(UU)
const getUnitCodes = async () => {
  try { return await mariaDB.query('unitCode'); }
  catch (err) { console.error('getUnitCodes error', err); return []; }
};

// ⭐️ 적합여부(DD) – 신설
const getSuitableCodes = async () => {
  try { return await mariaDB.query('suitableCode'); }
  catch (err) { console.error('getSuitableCodes error', err); return []; }
};

// ─────────────────────────────────────────────
//  1) 설비 전체조회 + 조건검색
//     filters: { code, name, type }
// ─────────────────────────────────────────────
const findEquipments = async (filters = {}) => {
  const code = filters.code || '';
  const name = filters.name || '';
  const type = filters.type || '';
  const params = [code, code, name, name, type, type];
  try {
    return await mariaDB.query('equipmentList', params);
  } catch (err) {
    console.error('findEquipments error', err);
    return [];
  }
};

// 1-a) 코드별 조회
const findEquipmentsByCode = async (code) => {
  try {
    return await mariaDB.query('equipmentListByCode', [code]);
  } catch (err) {
    console.error('findEquipmentsByCode error', err);
    return [];
  }
};

// 1-b) 명칭별 조회
const findEquipmentsByName = async (name) => {
  try {
    return await mariaDB.query('equipmentListByName', [name]);
  } catch (err) {
    console.error('findEquipmentsByName error', err);
    return [];
  }
};

// 1-c) 유형별 조회
const findEquipmentsByType = async (type) => {
  try {
    return await mariaDB.query('equipmentListByType', [type]);
  } catch (err) {
    console.error('findEquipmentsByType error', err);
    return [];
  }
};

// ─────────────────────────────────────────────
//  2) 설비 단건조회
// ─────────────────────────────────────────────
const findEquipment = async (equipmentCode) => {
  try {
    const rows = await mariaDB.query('equipmentInfo', [equipmentCode]);
    return rows[0] || null;
  } catch (err) {
    console.error('findEquipment error', err);
    return null;
  }
};

// ─────────────────────────────────────────────
//  3) 설비 등록 / 수정 (MERGE)
//     payload: {
//       equipment_code?, equipment_name, equipment_type,
//       install_date, manufacturer, next_inspection_dt,
//       is_suitable, unit_code, qty
//     }
//   • 신규 등록 시 equipment_code 미지정 → 자동생성
//   • unit_code → spec 자동 매핑
// ─────────────────────────────────────────────
const saveEquipment = async (equipment) => {
  try {
    // ───── 3-a) 신규 설비코드 생성
    if (!equipment.equipment_code) {
      const codeRows = await mariaDB.query('equipmentNextCode');
      equipment.equipment_code = codeRows[0]?.next_code;
      if (!equipment.equipment_code) throw new Error('설비코드 자동생성 실패');
    }

    // ───── 3-b) unit_code → spec 매핑
    const unitList = await getUnitCodes();
    equipment.spec =
      (unitList.find((u) => u.code_values === equipment.unit_code) || {})
        .code_name || '';

    // ───── 3-c) 기본값 세팅
    equipment.is_suitable =
      equipment.is_suitable === undefined ? 'Y' : equipment.is_suitable;

    const params = [
      equipment.equipment_code,
      equipment.equipment_name,
      equipment.equipment_type,
      equipment.install_date,
      equipment.manufacturer,
      equipment.next_inspection_dt,
      equipment.is_suitable,
      equipment.unit_code,
      equipment.spec,
      equipment.qty
    ];

    return await mariaDB.query('equipmentInsert', params);
  } catch (err) {
    console.error('saveEquipment error', err);
    throw err;
  }
};

// ─────────────────────────────────────────────
//  4) 설비 삭제
// ─────────────────────────────────────────────
const deleteEquipment = async (equipmentCode) => {
  try {
    return await mariaDB.query('equipmentDelete', [equipmentCode]);
  } catch (err) {
    console.error('deleteEquipment error', err);
    throw err;
  }
};

// ─────────────────────────────────────────────
//  5) 설비점검 이력 조회 (특정 설비)
// ─────────────────────────────────────────────
const equipmentInspectionsList = async (equipmentCode) => {
  try {
    return await mariaDB.query('equipmentInspectionsList', [equipmentCode]);
  } catch (err) {
    console.error('equipmentInspectionsList error', err);
    return [];
  }
};

// ─────────────────────────────────────────────
//  6) 점검 이력 등록 / 수정 (MERGE)
//     payload: {
//       inspection_id?, inspection_date, inspector_id,
//       contents, result, equipment_code
//     }
// ─────────────────────────────────────────────
const saveInspection = async (inspection) => {
  try {
    // 신규 ID 자동생성
    if (!inspection.inspection_id) {
      const rows = await mariaDB.query('inspectionNextId');  // ← 그대로 유지
      inspection.inspection_id = rows[0]?.next_id;
      if (!inspection.inspection_id) throw new Error('점검ID 자동생성 실패');
    }

    const params = [
      inspection.inspection_id,
      inspection.inspection_date,
      inspection.inspector_id,
      inspection.contents,
      inspection.result,
      inspection.equipment_code
    ];

    await mariaDB.query('insertInspection', params);

    // ⭐ 반드시 새 ID를 반환한다!
    return inspection.inspection_id;
  } catch (err) {
    console.error('saveInspection error', err);
    throw err;
  }
};

// 7) 점검 이력 삭제
const deleteInspection = async (inspectionId) => {
  try {
    return await mariaDB.query('deleteInspection', [inspectionId]);
  } catch (err) {
    console.error('deleteInspection error', err);
    throw err;
  }
};

// ─────────────────────────────────────────────
//  exports
// ─────────────────────────────────────────────
module.exports = {
  /* 공통코드 */
  getEquipmentTypeCodes,
  getUnitCodes,
  getSuitableCodes,        // ⭐️ 새로 추가

  /* 설비 CRUD */
  findEquipments,
  findEquipmentsByCode,
  findEquipmentsByName,
  findEquipmentsByType,
  findEquipment,
  saveEquipment,
  deleteEquipment,

  /* 점검 이력 */
  equipmentInspectionsList,
  saveInspection,
  deleteInspection,
};
