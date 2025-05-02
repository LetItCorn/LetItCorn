// server/services/process_service.js

const mariadb = require('../database/mapper.js');

const findProcesses = async (searchType, searchValue) => {
  let list;

  // 1) 검색조건 없으면 전체조회
  if (!searchType || !searchValue) {
    list = await mariadb
      .query('selectProcessList')
      .catch(err => {
        console.error(err);
        return [];
      });
  } else {
    // 2) 검색조건에 따라 SQL 분기
    if (searchType === 'code') {
      list = await mariadb
        .query('selectProcessOne', [searchValue])
        .catch(err => {
          console.error(err);
          return [];
        });
    } else if (searchType === 'name') {
      list = await mariadb
        .query('selectProcessByName', [searchValue])
        .catch(err => {
          console.error(err);
          return [];
        });
    } else if (searchType === 'duration') {
      list = await mariadb
        .query('selectProcessByDuration', [searchValue])
        .catch(err => {
          console.error(err);
          return [];
        });
    } else {
      list = [];
    }
  }

  return list;
};

const createProcess = async ({ process_code, process_header, process_name, duration_min }) => {
  return mariadb.query('insertProcess', [
    process_code,
    process_header,
    process_name,
    duration_min,
  ]);
};

const updateProcess = async ({ process_code, process_header, process_name, duration_min }) => {
  return mariadb.query('updateProcess', [
    process_header,
    process_name,
    duration_min,
    process_code,
  ]);
};

const deleteProcess = async (process_code) => {
  return mariadb.query('deleteProcess', [process_code]);
};

module.exports = {
  findProcesses,
  createProcess,
  updateProcess,
  deleteProcess,
};
