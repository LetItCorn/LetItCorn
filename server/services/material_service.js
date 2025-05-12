// ==== services/material_service.js ==== 

/**
 * 1) 자재 전체조회 + 조건검색
 *    filters: { code: string, name: string, unit: string }
 *    - mater_code, mater_name, unit_code 필터가 빈 문자열이면 전체조회
 *    - SQL: materialList
 */
const findMaterials = async (filters = {}) => {
  // 필터 기본값 설정
  const code = filters.code || '';
  const name = filters.name || '';
  const unit = filters.unit || '';
  // materialList SQL의 (?,?),(?,?),(?,?) 순서에 맞춰 파라미터 배열을 구성
  const params = [ code, code, name, name, unit, unit ];

  try {
    // materialList 쿼리 실행 후 결과 반환
    return await mariaDB.query('materialList', params);
  } catch (err) {
    console.error('findMaterials error', err);
    return [];
  }
};

/**
 * 2) 단위코드(공통코드 UU) 조회
 *    - SQL: unitCode
 *    - 자재 spec 설정을 위해 사용
 */
const unitCode = async () => {
  try {
    return await mariaDB.query('unitCode');
  } catch (err) {
    console.error('unitCode error', err);
    return [];
  }
};

/**
 * 3) 자재 단건조회 (mater_code 기준)
 *    mater_code에 해당하는 한 건 조회
 *    - SQL: materialInfo
 */
const findByMaterial = async (materCode) => {
  try {
    const rows = await mariaDB.query('materialInfo', [ materCode ]);
    // 조회된 행이 있으면 첫 번째, 없으면 null
    return rows[0] || null;
  } catch (err) {
    console.error('findByMaterial error', err);
    return null;
  }
};

/**
 * 4) 자재 등록/수정 (MERGE)
 *    - INSERT 시 PK 충돌하면 UPDATE 수행
 *    - SQL: materialInsert
 */
const saveMaterial = async (material) => {
  // unitCode 목록에서 unit_code와 매칭되는 code_name을 spec에 세팅
  const units = await unitCode();
  material.spec = (units.find(u => u.code_values === material.unit_code) || {}).code_name || '';

  // materialInsert 쿼리 파라미터 순서에 맞춰 배열 구성
  const params = [
    material.mater_code,    // 자재 코드
    material.mater_name,    // 자재 명칭
    material.safe_stock,    // 안전 재고량
    material.current_stock, // 현재 재고량
    material.m_price,       // 자재 단가
    material.spec,          // 규격 (code_name)
    material.unit_code      // 단위 코드
  ];

  try {
    return await mariaDB.query('materialInsert', params);
  } catch (err) {
    console.error('saveMaterial error', err);
    throw err;
  }
};

/**
 * 5) 자재 삭제 (mater_code 기준)
 *    - SQL: materialDelete
 */
const deleteMaterial = async (materCode) => {
  try {
    return await mariaDB.query('materialDelete', [ materCode ]);
  } catch (err) {
    console.error('deleteMaterial error', err);
    throw err;
  }
};

// ============================================================================
const mariadb = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

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
    findAllMaterials,
    findMaterialByCode,
    addMaterial,
    updateMaterialInfo,
    removeMaterial,
    findAllMAtLOTlist,
    findMaterialStock
};
