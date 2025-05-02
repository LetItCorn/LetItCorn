// server/services/defect_codes_service.js
const mariadb = require('../database/mapper.js');

const findDefectCodes = async (searchType, searchValue) => {
  let list;
  if (!searchType || !searchValue) {
    // 전체 조회
    list = await mariadb.query('selectDefectList');
  } else {
    // 조건별 조회
    if (searchType === 'code') {
      list = await mariadb.query('selectDefectOne', [searchValue]);
    } else if (searchType === 'type') {
      list = await mariadb.query('selectDefectByType', [searchValue]);
    } else if (searchType === 'used') {
      list = await mariadb.query('selectDefectByUsed', [searchValue]);
    } else {
      list = [];
    }
  }
  return list;
};

const createDefectCode = async ({ defect_code, defect_type, is_used, created_date }) => {
  return mariadb.query('insertDefect', [ defect_code, defect_type, is_used, created_date ]);
};

const updateDefectCode = async ({ defect_code, defect_type, is_used }) => {
  return mariadb.query('updateDefect', [ defect_type, is_used, defect_code ]);
};

const deleteDefectCode = async (defect_code) => {
  return mariadb.query('deleteDefect', [ defect_code ]);
};

module.exports = {
  findDefectCodes,
  createDefectCode,
  updateDefectCode,
  deleteDefectCode,
};
