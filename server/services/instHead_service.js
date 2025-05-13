const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');
const { convertObjToQuery } = require('../utils/converts.js');

const findAllInstHead = async ({ startDate, endDate }) => {
    let list = await mariadb.query("selectInstHeadList", [startDate, endDate]);
    return list;
   };
const findByInstHead = async (instHeadNo) => {
     let list = await mariadb.query("selectInstHeaderById", [instHeadNo]);
     return list;
    };
const modifyInstHead = async (instHeadNo, instHeadInfo) => {
  let data = [instHeadInfo, instHeadNo];
  let resInfo = await mariadb.query("updateInstHead", data);
  
  let result = null;
  if (resInfo.affectedRows > 0) {
    instHeadInfo.no = instHeadNo;
    result = {
      isUpdated: true,
      instHeadInfo,
    };
  } else {
    result = {
      isUpdated: false,
    };
  }
  return result;
 };

 const removeInstHead = async (instHeadNo) => {
   let result = await mariadb.query("deleteInstHead", instHeadNo);
   return result;
  };

module.exports = {
  findAllInstHead,
  findByInstHead,
  modifyInstHead,
  removeInstHead,
}
