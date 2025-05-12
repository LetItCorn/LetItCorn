// server/services/bom_service.js

const mapper = require('../database/mapper.js');

//
// ─── BOM 마스터 서비스 ────────────────────────────
//

/**
 * BOM 전체 조회 또는 필터 조회
 * @param {object} [filter]
 * @param {string} [filter.bomId]     // BOM_ID로 필터링
 * @param {string} [filter.itemCode]  // 완제품 코드로 필터링
 * @returns {Promise<Array>}
 */
async function findBoms({ bomId = '', itemCode = '' } = {}) {
  try {
    return await mapper.query('bomList', [
      bomId, bomId,
      itemCode, itemCode
    ]);
  } catch (err) {
    console.error('findBoms error:', err);
    return [];
  }
}

/**
 * 단건 조회 (bom_id 기준)
 * @param {string} bomId
 * @returns {Promise<Object|null>}
 */
async function findBomById(bomId) {
  try {
    const rows = await mapper.query('bomInfo', [bomId]);
    return rows[0] || null;
  } catch (err) {
    console.error('findBomById error:', err);
    return null;
  }
}

/**
 * 새 BOM 등록
 * @param {{ item_code: string, item_name: string }} bom
 * @returns {Promise<*>}
 */
async function createBom({ item_code, item_name }) {
  try {
    return await mapper.query('bomInsert', [
      item_code,
      item_name
    ]);
  } catch (err) {
    console.error('createBom error:', err);
    throw err;
  }
}

/**
 * BOM 수정
 * @param {{ bom_id: string, item_code: string, item_name: string, registered_date: string }} bom
 * @returns {Promise<*>}
 */
async function updateBom({ bom_id, item_code, item_name, registered_date }) {
  try {
    return await mapper.query('bomUpdate', [
      item_code,
      item_name,
      registered_date,
      bom_id
    ]);
  } catch (err) {
    console.error('updateBom error:', err);
    throw err;
  }
}

/**
 * BOM 삭제
 * @param {string} bomId
 * @returns {Promise<*>}
 */
async function deleteBom(bomId) {
  try {
    return await mapper.query('bomDelete', [bomId]);
  } catch (err) {
    console.error('deleteBom error:', err);
    throw err;
  }
}

//
// ─── BOM 구성품 서비스 ────────────────────────────
//

/**
 * 특정 BOM 의 모든 구성품 조회
 * @param {string} bomId
 * @returns {Promise<Array>}
 */
async function findComponentsByBom(bomId) {
  try {
    return await mapper.query('bomComponentsList', [bomId]);
  } catch (err) {
    console.error('findComponentsByBom error:', err);
    return [];
  }
}

/**
 * 구성품 단건 조회 (item_seq_id 기준)
 * @param {string|number} seqId
 * @returns {Promise<Object|null>}
 */
async function findComponentById(seqId) {
  try {
    const rows = await mapper.query('bomComponentInfo', [seqId]);
    return rows[0] || null;
  } catch (err) {
    console.error('findComponentById error:', err);
    return null;
  }
}

/**
 * BOM 구성품 등록
 * material 테이블에서 mater_code로 나머지 정보를 조회 후 INSERT
 * @param {{ item_seq_id: number|string, bom_id: string, mater_code: string, quantity: number }} comp
 * @returns {Promise<*>}
 */
async function createComponent({ item_seq_id, bom_id, mater_code, quantity }) {
  const params = [
    item_seq_id,
    bom_id,
    quantity,
    mater_code
  ];
  try {
    return await mapper.query('bomComponentInsert', params);
  } catch (err) {
    console.error('createComponent error:', err);
    throw err;
  }
}

/**
 * BOM 구성품 수정
 * material 테이블에서 mater_code로 최신 정보를 조회 후 UPDATE
 * @param {{ item_seq_id: number|string, mater_code: string, quantity: number }} comp
 * @returns {Promise<*>}
 */
async function updateComponent({ item_seq_id, mater_code, quantity }) {
  const params = [
    mater_code,
    quantity,
    item_seq_id
  ];
  try {
    return await mapper.query('bomComponentUpdate', params);
  } catch (err) {
    console.error('updateComponent error:', err);
    throw err;
  }
}

/**
 * BOM 구성품 삭제
 * @param {string|number} seqId
 * @returns {Promise<*>}
 */
async function deleteComponent(seqId) {
  try {
    return await mapper.query('bomComponentDelete', [seqId]);
  } catch (err) {
    console.error('deleteComponent error:', err);
    throw err;
  }
}

//
// ─── 완제품 목록 조회 (BOM 등록 Modal용) ────────────────────────────
//

/**
 * 완제품(item_type='C01') 목록 조회
 * @returns {Promise<Array>}
 */
async function bomitemsList() {
  try {
    return await mapper.query('bomitemsList', []);
  } catch (err) {
    console.error('bomitemsList error:', err);
    return [];
  }
}

module.exports = {
  // BOM master
  findBoms,
  findBomById,
  createBom,
  updateBom,
  deleteBom,

  // BOM components
  findComponentsByBom,
  findComponentById,
  createComponent,
  updateComponent,
  deleteComponent,

  // BOM 등록용 완제품 리스트
  bomitemsList,
};
