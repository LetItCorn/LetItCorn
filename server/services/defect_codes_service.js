// server/services/defect_codes_service.js

const mapper = require('../database/mapper.js');

/**
 * 1) 전체조회 + 조건검색
 *    filters: { code: string, type: string, isUsed: string }
 */
async function findDefectCodes({ code = '', type = '', isUsed = '' } = {}) {
  try {
    // SQL: defectCodesList
    const rows = await mapper.query('defectCodesList', [
      code, code,
      type, type,
      isUsed, isUsed
    ]);
    return rows;
  } catch (err) {
    console.error('findDefectCodes error:', err);
    return [];
  }
}

/**
 * 1-a) 코드 단독 조회 (LIKE 검색)
 */
async function findDefectCodesByCode(code) {
  try {
    const rows = await mapper.query('defectCodesByCode', [code]);
    return rows;
  } catch (err) {
    console.error('findDefectCodesByCode error:', err);
    return [];
  }
}

/**
 * 1-b) 유형 단독 조회 (LIKE 검색)
 */
async function findDefectCodesByType(type) {
  try {
    const rows = await mapper.query('defectCodesByType', [type]);
    return rows;
  } catch (err) {
    console.error('findDefectCodesByType error:', err);
    return [];
  }
}

/**
 * 1-c) 사용 여부 단독 조회
 */
async function findDefectCodesByUsed(isUsed) {
  try {
    const rows = await mapper.query('defectCodesByUsed', [isUsed]);
    return rows;
  } catch (err) {
    console.error('findDefectCodesByUsed error:', err);
    return [];
  }
}

/**
 * 2) 단건조회 (정확 일치)
 */
async function findDefectCode(code) {
  try {
    const rows = await mapper.query('defectCodeInfo', [code]);
    return rows[0] || null;
  } catch (err) {
    console.error('findDefectCode error:', err);
    return null;
  }
}

/**
 * 3) 등록
 */
async function createDefectCode(defect) {
  const params = [
    defect.defect_code,
    defect.defect_type,
    defect.is_used,
    defect.created_date
  ];
  try {

     const defectCode = await mapper.query('selectdefectCode');
      
    if(defect.defect_code == undefined || defect.defect_code == ""){
      params[0] = defectCode[0].next_defect_code;
    }


    return await mapper.query('defectCodeInsert', params);
  } catch (err) {
    console.error('createDefectCode error:', err);
    throw err;
  }
}

/**
 * 4) 수정
 */
async function updateDefectCode(defect) {
  const params = [
    defect.defect_type,
    defect.is_used,
    defect.created_date,
    defect.defect_code
  ];
  try {
    return await mapper.query('defectCodeUpdate', params);
  } catch (err) {
    console.error('updateDefectCode error:', err);
    throw err;
  }
}

/**
 * 5) 삭제
 */
async function deleteDefectCode(code) {
  try {
    return await mapper.query('defectCodeDelete', [code]);
  } catch (err) {
    console.error('deleteDefectCode error:', err);
    throw err;
  }
}

module.exports = {
  findDefectCodes,
  findDefectCodesByCode,
  findDefectCodesByType,
  findDefectCodesByUsed,
  findDefectCode,
  createDefectCode,
  updateDefectCode,
  deleteDefectCode
};
