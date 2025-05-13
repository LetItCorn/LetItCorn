// ==== services/material_service.js ==== 

const mariaDB = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

/** 
 * 1) 전체 조회 + 조건별 검색
 * @param {object} filters - { code: string, name: string }
 */
const findMaterials = async ({ code = '', name = '' }) => {
  // SQL: materialList
  // WHERE (? = '' OR mater_code LIKE …) AND (? = '' OR mater_name LIKE …)
  const params = [code, code, name, name];
  try {
    const list = await mariaDB.query('materialList', params);
    return list;
  } catch (err) {
    console.error('findMaterials error', err);
    return [];
  }
};

// 2) 단위코드(공통코드 UU) 조회
const unitCode = async () => {
  try {
    return await mariaDB.query('unitCode');
  } catch (err) {
    console.error('unitCode error', err);
    return [];
  }
};

/**
 * 3) 코드별 조회 (정확 일치)
 * @param {string} code - 조회할 mater_code
 */
const MaterialByCode = async (code) => {
  // SQL: materialByCode
  try {
    const rows = await mariaDB.query('materialByCode', [code]);
    return rows[0] || null;
  } catch (err) {
    console.error('MaterialByCode error', err);
    return null;
  }
};

/**
 * 4) 명칭별 조회 (LIKE 검색)
 * @param {string} name - 조회할 mater_name 일부
 */
const findMaterialsByName = async (name) => {
  // SQL: materialByName
  try {
    const list = await mariaDB.query('materialByName', [name]);
    return list;
  } catch (err) {
    console.error('findMaterialsByName error', err);
    return [];
  }
};

/**
 * 5) 등록 / 수정  (INSERT … ON DUPLICATE KEY UPDATE …)
 */
const saveMaterial = async (material) => {
  /* ─────────────────────────────────────────────
   * 1. 단위코드 → 단위명(spec) 매핑
   * ───────────────────────────────────────────── */
  let unit_name = '';
  if (material.unit_code) {
    const units = await unitCode();  // UU 공통코드 전체
    unit_name =
      (units.find(u => u.code_values === material.unit_code) || {}).code_name || '';
  }

  /* ─────────────────────────────────────────────
   * 2. mater_code 가 비어 있으면 새 코드 생성
   * ───────────────────────────────────────────── */
  let newCode = material.mater_code;
  if (!newCode) {
    const rows = await mariaDB.query('selectMaterialMaterCode'); // ← 새 코드!
    newCode = rows[0]?.next_mater_code;
  }

  /* ─────────────────────────────────────────────
   * 3. 파라미터 구성 후 저장
   * ───────────────────────────────────────────── */
  const params = [
    newCode,
    material.mater_name || '',
    material.safe_stock ?? 0,
    material.current_stock ?? 0,
    material.m_price ?? 0,
    unit_name,                // spec 자리에 ‘kg’, ‘L’ 같은 단위명
    material.unit_code || ''  // 마지막은 단위 “코드”
  ];

  try {
    return await mariaDB.query('materialSave', params);
  } catch (err) {
    console.error('saveMaterial error', err);
    throw err;
  }
};

/**
 * 6) 삭제 (mater_code 기준)
 * @param {string} code - 삭제할 mater_code
 */
const deleteMaterial = async (code) => {
  // SQL: materialDelete
  try {
    const result = await mariaDB.query('materialDelete', [code]);
    return result;
  } catch (err) {
    console.error('deleteMaterial error', err);
    throw err;
  }
};

// ============================================================================

// 전체 자재 목록 조회
const findAllMaterials = async () => {
    let list = await mariadb.query('selectMaterialList')
    .catch(err => console.error(err));
    return list;
};

// 자재 LOT 목록 조회 
const findAllMAtLOTlist = async () => {
    let list = await mariadb.query('selectMatLotList')
    .catch(err => console.error(err));
    return list;
}


// 단건 조회
const findMaterialByCode = async (code) => {
    let list = await mariadb.query('selectMaterialOne', code)
    .catch(err => { console.error(err); return []; });
    return list[0] || null;
};

// 자재 등록
const addMaterial = async (materialInfo) => {
    const cols = ['mater_code','mater_name','mater_unit','safe_stock'];
    const data = convertObjToAry(materialInfo, cols);
    let res = await mariadb.query('insertMaterial', data)
    .catch(err => { console.error(err); return null; });
    return { isSuccess: res && res.affectedRows > 0 };
};

// 자재 수정
const updateMaterialInfo = async (code, materialInfo) => {
    let res = await mariadb.query('updateMaterial', [materialInfo, code])
    .catch(err => { console.error(err); return null; });
    return { isUpdated: res && res.affectedRows > 0 };
};

// 자재 삭제
const removeMaterial = async (code) => {
    let res = await mariadb.query('deleteMaterial', code)
    .catch(err => { console.error(err); return null; });
    return { isDeleted: res && res.affectedRows > 0 };
};

async function findMaterialStock() {
    // vw_material_stock 뷰를 바로 조회
    return await mariadb.query('selectMaterialStock', [])
    .catch(err => { console.error(err); return []; });
};

module.exports = {
    findMaterials,
    unitCode,
    MaterialByCode,
    findMaterialsByName,
    saveMaterial,
    deleteMaterial,

    findAllMaterials,
    findMaterialByCode,
    addMaterial,
    updateMaterialInfo,
    removeMaterial,
    findAllMAtLOTlist,
    findMaterialStock
};
