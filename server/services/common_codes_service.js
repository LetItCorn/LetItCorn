// server/services/common_codes_service.js
const mariadb = require('../database/mapper.js');

const findCommonCodes = async (searchType, searchValue) => {
  let list;
  // 1) 전체 조회
  if (!searchType || !searchValue) {
    list = await mariadb.query('selectCommonList');
  } else if (searchType === 'group') {
    list = await mariadb.query('selectCommonByGroup', [searchValue]);
  } else if (searchType === 'value') {
    list = await mariadb.query('selectCommonByValue', [searchValue]);
  } else if (searchType === 'name') {
    list = await mariadb.query('selectCommonByName', [searchValue]);
  } else if (searchType === 'used') {
    list = await mariadb.query('selectCommonByUseYn', [searchValue]);
  } else if (searchType === 'one') {
    // 단건조회: searchValue = [group, value]
    list = await mariadb.query('selectCommonOne', searchValue);
  } else {
    list = [];
  }
  return list;
};

const createCommonCode = async ({ code_group, code_value, code_name, use_yn, comm_etc }) => {
  return mariadb.query('insertCommon', [
    code_group, code_value, code_name, use_yn, comm_etc
  ]);
};

const updateCommonCode = async ({ code_group, code_value, code_name, use_yn, comm_etc }) => {
  return mariadb.query('updateCommon', [
    code_name, use_yn, comm_etc, code_group, code_value
  ]);
};

const deleteCommonCode = async (code_group, code_value) => {
  return mariadb.query('deleteCommon', [code_group, code_value]);
};

module.exports = {
  findCommonCodes,
  createCommonCode,
  updateCommonCode,
  deleteCommonCode,
};
