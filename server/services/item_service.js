// server/services/item_service.js

const maria = require('../database/mapper.js');

// 품목 조회: searchType, searchValue 따라 분기
const findItems = async (searchType, searchValue) => {
  let list;

  // 1) 검색조건 없으면 전체 조회
  if (!searchType || !searchValue) {
    list = await maria.query('selectItemList')
      .catch(err => { console.error(err); return []; });
  } else {
    // 2) 검색조건 있을 때
    if (searchType === 'code') {
      list = await maria.query('selectItemOne', [searchValue])
        .catch(err => { console.error(err); return []; });
    }
    else if (searchType === 'name') {
      list = await maria.query('selectItemByName', [searchValue])
        .catch(err => { console.error(err); return []; });
    }
    else if (searchType === 'type') {
      list = await maria.query('selectItemByType', [searchValue])
        .catch(err => { console.error(err); return []; });
    }
    else {
      // 잘못된 searchType
      list = [];
    }
  }

  return list;
};

// 품목 등록
const createItem = async (item) => {
  const { item_code, item_name, item_type, unit_code, spec } = item;

  // item_type, unit_code는 반드시 공통코드(C01/C02/C03, U01/U02/U03)
  return await maria.query(
    'insertItem',
    [item_code, item_name, item_type, unit_code, spec]
  )
  .catch(err => { console.error(err); throw err; });
};

// 품목 수정
const updateItem = async (item) => {
  const { item_code, item_name, item_type, unit_code, spec } = item;
  return await maria.query(
    'updateItem',
    [item_name, item_type, unit_code, spec, item_code]
  )
  .catch(err => { console.error(err); throw err; });
};

// 품목 삭제
const deleteItem = async (item_code) => {
  return await maria.query('deleteItem', [item_code])
    .catch(err => { console.error(err); throw err; });
};

module.exports = {
  findItems,
  createItem,
  updateItem,
  deleteItem
};
