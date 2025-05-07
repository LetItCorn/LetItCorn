// server/services/common_codes_service.js

const mapper = require('../database/mapper.js');

/**
 * 1) 전체조회 + 조건검색
 * @param {object} [filters]
 * @param {string} [filters.group]  // 그룹코드
 * @param {string} [filters.rear]   // 하위코드
 * @param {string} [filters.name]   // 코드명
 * @param {string} [filters.useYn]  // 사용여부
 * @returns {Promise<Array>} 공통코드 리스트
 */
async function findCommonCodes({ group = '', rear = '', name = '', useYn = '' } = {}) {
  // SQL에서 (? = '' OR ...) 절이 동작하도록 빈 문자열로 초기화
  const params = [
    group, group,
    rear, rear,
    name, name,
    useYn, useYn
  ];
  try {
    return await mapper.query('commonCodesList', params);
  } catch (err) {
    console.error('findCommonCodes error:', err);
    return [];
  }
}

/**
 * 1-a) 그룹별 조회
 * @param {string} group - 조회할 그룹코드
 */
async function findCommonCodesByGroup(group) {
  try {
    return await mapper.query('commonCodesByGroup', [group]);
  } catch (err) {
    console.error('findCommonCodesByGroup error:', err);
    return [];
  }
}

/**
 * 1-b) 하위코드별 조회
 * @param {string} rear - 조회할 하위코드
 */
async function findCommonCodesByRear(rear) {
  try {
    return await mapper.query('commonCodesByRear', [rear]);
  } catch (err) {
    console.error('findCommonCodesByRear error:', err);
    return [];
  }
}

/**
 * 1-c) 코드명으로 조회 (LIKE 검색)
 * @param {string} name - 조회할 코드명
 */
async function findCommonCodesByName(name) {
  try {
    return await mapper.query('commonCodesByName', [name]);
  } catch (err) {
    console.error('findCommonCodesByName error:', err);
    return [];
  }
}

/**
 * 1-d) 사용여부별 조회
 * @param {string} useYn - 'Y' 또는 'N'
 */
async function findCommonCodesByUseYn(useYn) {
  try {
    return await mapper.query('commonCodesByUseYn', [useYn]);
  } catch (err) {
    console.error('findCommonCodesByUseYn error:', err);
    return [];
  }
}

/**
 * 2) 단건조회 (group + rear 기준)
 * @param {string} group
 * @param {string} rear
 */
async function findCommonCode(group, rear) {
  try {
    const rows = await mapper.query('commonCodeInfo', [group, rear]);
    return rows[0] || null;
  } catch (err) {
    console.error('findCommonCode error:', err);
    return null;
  }
}

/**
 * 3) 등록: 새 공통코드 추가
 */
async function createCommonCode(code) {
  const params = [
    code.code_group,
    code.code_rear,
    code.code_name,
    code.use_yn,
    code.comm_etc,
    code.code_values
  ];
  try {
    return await mapper.query('commonCodeInsert', params);
  } catch (err) {
    console.error('createCommonCode error:', err);
    throw err;
  }
}

/**
 * 4) 수정: 기존 공통코드 업데이트
 */
async function updateCommonCode(code) {
  const params = [
    code.code_name,
    code.use_yn,
    code.comm_etc,
    code.code_values,
    code.code_group,
    code.code_rear
  ];
  try {
    return await mapper.query('commonCodeUpdate', params);
  } catch (err) {
    console.error('updateCommonCode error:', err);
    throw err;
  }
}

/**
 * 5) 삭제: 공통코드 삭제
 */
async function deleteCommonCode(group, rear) {
  try {
    return await mapper.query('commonCodeDelete', [group, rear]);
  } catch (err) {
    console.error('deleteCommonCode error:', err);
    throw err;
  }
}

module.exports = {
  findCommonCodes,
  findCommonCodesByGroup,
  findCommonCodesByRear,
  findCommonCodesByName,
  findCommonCodesByUseYn,
  findCommonCode,
  createCommonCode,
  updateCommonCode,
  deleteCommonCode
};
