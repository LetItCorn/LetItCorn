// server/services/item_service.js

const mariaDB = require('../database/mapper.js');

// 품목 조회
const findItems = async () => {
    let list = await mariaDB.query('itemList')
                         .catch(err => console.log(err));
    return list;
  };

// 품목 단건조회
const findByItem = async (selectedItem)=>{
  let list = await mariaDB.query('itemInfo', selectedItem)
                     .catch(err => console.log(err));
  let info = list[0];
  return info;
};

// 등록
const createItem = async (itemInfo)=>{
  let addItem = convertAary(itemInfo);
  let result = await mariadb.query('itemInsert', addItem);
  return result;
};

function convertAary(target){
  return [
    target.item_code,
    target.item_name,
    target.item_type,
    target.unit_code,
    target.spec
  ];
}

module.exports = {
  findItems,
  findByItem,
  createItem,
};
