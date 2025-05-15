// server/services/process_service.js

const mariaDB = require('../database/mapper.js');

// 단위코드(공통코드 UU) 가져오기
const unitCode = async () => {
  try {
    return await mariaDB.query('unitCode');
  } catch (err) {
    console.error('unitCode error', err);
    return [];
  }
};

/**
 * 1) 전체조회: 조건 없이 모든 공정 조회
 */
const findProcesses = async () => {
  const list = await mariaDB
    .query('processList', [])
    .catch(err => {
      console.error('findProcesses error', err);
      return [];
    });
  return list;
};

/**
 * 1-a) 공정 코드 LIKE 검색
 * @param {string} code - 공정 코드 일부
 */
const findProcessesByCode = async (code) => {
  const list = await mariaDB
    .query('processListByCode', [code])
    .catch(err => {
      console.error('findProcessesByCode error', err);
      return [];
    });
  return list;
};

/**
 * 1-b) 공정 이름 LIKE 검색
 * @param {string} name - 공정 이름 일부
 */
const findProcessesByName = async (name) => {
  const list = await mariaDB
    .query('processListByName', [name])
    .catch(err => {
      console.error('findProcessesByName error', err);
      return [];
    });
  return list;
};

/**
 * 2) 단건 조회: 공정 코드로 정확히 조회
 * @param {string} processCode - 공정코드
 */
const findProcess = async (processCode) => {
  const rows = await mariaDB
    .query('processInfo', [processCode])
    .catch(err => {
      console.error('findProcess error', err);
      return [];
    });
  return rows[0] || null;
};

/**
 * 3) 등록 (또는 수정): 공정 등록 (코드 자동 생성 포함)
 * @param {object} process - 등록할 공정 정보
 */
const createProcess = async (process) => {
  // 기본 파라미터 배열: 등록 시 null일 수 있는 코드 먼저 포함
  let params = [
    process.process_code,
    process.process_name,
    process.duration_min,
    process.unit_code,
    process.spec
  ];

  // process_code가 없으면 자동 생성
  const nextCode = await mariaDB.query('selectPrecessProcessCode');
  if (!process.process_code || process.process_code.trim() === '') {
    params[0] = nextCode[0].next_process_code;
  }

  const result = await mariaDB
    .query('processInsert', params)
    .catch(err => {
      console.error('createProcess error', err);
      throw err;
    });
  return result;
};

/**
 * 4) 수정: 공정 정보 업데이트
 * @param {object} process - 수정할 공정 데이터
 */
const updateProcess = async (process) => {
  const params = [
    process.process_name,
    process.duration_min,
    process.unit_code,
    process.spec,
    process.process_code
  ];
  const result = await mariaDB
    .query('processUpdate', params)
    .catch(err => {
      console.error('updateProcess error', err);
      throw err;
    });
  return result;
};

/**
 * 5) 삭제: 공정 코드 기준 삭제
 * @param {string} processCode - 공정코드
 */
const deleteProcess = async (processCode) => {
  const result = await mariaDB
    .query('processDelete', [processCode])
    .catch(err => {
      console.error('deleteProcess error', err);
      throw err;
    });
  return result;
};

module.exports = {
  unitCode,
  findProcesses,
  findProcessesByCode,
  findProcessesByName,
  findProcess,
  createProcess,
  updateProcess,
  deleteProcess,
};
