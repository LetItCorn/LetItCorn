const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');
const { convertObjToQuery } = require('../utils/converts.js');

const findAllInstHead = async (searchList) => {
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : 
  '';
    let list = await mariadb.query("selectInstHeadList", searchKeyword);
    return list;
   };
const findByInstHead = async (instHeadNo) => {
     let list = await mariadb.query("selectInstHeaderById", instHeadNo);
     let info = list[0];
     return info;
    };
const addNewInstHead = async (instHeadInfo) => {
      let insertColumns = ['plans_head', 'plan_start', 'plan_end', 'plan_stat', 'plans_reg', 'planer'];
      let data = convertObjToAry(instHeadInfo, insertColumns);
      let resInfo = await mariadb.query("insertInstHeader", data);
      let result = null;
      if (resInfo.insertId > 0) {
        result = {
          isSuccessed: true,
          instHeadNo: resInfo.insertId,
        };
      } else {
        result = {
          isSuccessed: false,
        };
      }
      return result;
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
  addNewInstHead,
  modifyInstHead,
  removeInstHead,
}
