// server/services/equipment_service.js
const maria = require('../database/mapper.js');

const findEquipments = async (searchType, searchValue) => {
  let list;

  // 1) 검색조건 없으면 → 전체 조회
  if (!searchType || !searchValue) {
    list = await maria.query('selectEquipmentList')
      .catch(err => { console.error(err); return []; });
  } else {
    // 2) 조건에 따라 별도 SQL 호출
    if (searchType === 'code') {
      list = await maria.query('selectEquipmentByCode', [searchValue])
        .catch(err => { console.error(err); return []; });
    } else if (searchType === 'name') {
      list = await maria.query('selectEquipmentByName', [`%${searchValue}%`])
        .catch(err => { console.error(err); return []; });
    } else if (searchType === 'manufacturer') {
      list = await maria.query('selectEquipmentByManufacturer', [searchValue])
        .catch(err => { console.error(err); return []; });
    } else {
      // 그 외 잘못된 searchType
      list = [];
    }
  }

  return list;
};

module.exports = {
  findEquipments,
};
