// server/services/bom_service.js
const mapper = require('../database/mapper.js');

/**
 * BOM 목록 조회
 * @param {string} itemCode (optional) 완제품 코드
 */
const findBoms = async (itemCode) => {
  if (itemCode) {
    // itemCode가 있으면 해당 코드로 필터
    return await mapper.query('selectBomByItemCode', [itemCode]);
  } else {
    // 없으면 전체 조회
    return await mapper.query('selectBomAll');
  }
};

/**
 * 단건 조회 (bom_id 기준)
 */
const findBomById = async (bomId) => {
  const results = await mapper.query('selectBomById', [bomId]);
  return results[0] || null;
};

/**
 * 새 BOM 등록
 * @param {{bom_id:string, item_name:string, item_code:string}} bom
 */
const createBom = async (bom) => {
  const { bom_id, item_name, item_code } = bom;
  return await mapper.query('insertBom', [bom_id, item_name, item_code]);
};

/**
 * 기존 BOM 수정
 * @param {{bom_id:string, item_name:string, item_code:string}} bom
 */
const updateBom = async (bom) => {
  const { bom_id, item_name, item_code } = bom;
  return await mapper.query('updateBom', [item_name, item_code, bom_id]);
};

/**
 * BOM 삭제
 * @param {string} bomId
 */
const deleteBom = async (bomId) => {
  return await mapper.query('deleteBom', [bomId]);
};

module.exports = {
  findBoms,
  findBomById,
  createBom,
  updateBom,
  deleteBom,
};
