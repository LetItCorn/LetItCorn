// ==== services/material_main_service.js ==== 

const mariadb = require('../database/mapper.js');
// const { convertObjToAry } = require('../utils/converts.js');

/** 
 * 1) 전체 조회 + 조건별 검색
 * @param {object} filters - { code: string, name: string }
 */
const findMaterials = async ({ code = '', name = '' }) => {
  // SQL: materialList
  // WHERE (? = '' OR mater_code LIKE …) AND (? = '' OR mater_name LIKE …)
  const params = [code, code, name, name];
  try {
    const list = await mariadb.query('materialList', params);
    return list;
  } catch (err) {
    console.error('findMaterials error', err);
    return [];
  }
};

// 2) 단위코드(공통코드 UU) 조회
const unitCode = async () => {
  try {
    return await mariadb.query('unitCode');
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
    const rows = await mariadb.query('materialByCode', [code]);
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
    const list = await mariadb.query('materialByName', [name]);
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
    const rows = await mariadb.query('selectMaterialMaterCode'); // ← 새 코드!
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
    return await mariadb.query('materialSave', params);
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
    const result = await mariadb.query('materialDelete', [code]);
    return result;
  } catch (err) {
    console.error('deleteMaterial error', err);
    throw err;
  }
};

module.exports = {
    findMaterials,
    unitCode,
    MaterialByCode,
    findMaterialsByName,
    saveMaterial,
    deleteMaterial

};