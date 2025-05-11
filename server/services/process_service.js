// server/services/process_service.js

const mariaDB = require('../database/mapper.js');

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
 * 1-a) 코드별 조회 (LIKE 검색): 공정코드 일부 매칭
 * @param {string} code - 검색할 공정코드
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
 * 1-b) 이름별 조회 (LIKE 검색): 공정명 일부 매칭
 * @param {string} name - 검색할 공정명
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
 * 2) 단건조회: 정확히 일치하는 공정코드로 조회
 * @param {string} processCode - 조회할 공정코드
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
 * 3) 등록: 새로운 공정 추가
 * @param {object} process - 등록할 공정 데이터
 */
const createProcess = async (process) => {
  let params = [
    process.process_code,
    process.process_name,
    process.duration_min
  ];

    const process_code = await mariaDB.query('selectPrecessProcessCode');    
    if(process.process_code == undefined || process.process_code == "" ){
      params[0] = process_code[0].next_process_code;
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
 * 4) 수정: 기존 공정 정보 업데이트
 * @param {object} process - 수정할 공정 데이터
 */
const updateProcess = async (process) => {
  const params = [
    process.process_header,
    process.process_name,
    process.duration_min,
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
 * 5) 삭제: 공정코드로 공정 삭제
 * @param {string} processCode - 삭제할 공정코드
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
  findProcesses,
  findProcessesByCode,
  findProcessesByName,
  findProcess,
  createProcess,
  updateProcess,
  deleteProcess,
};
