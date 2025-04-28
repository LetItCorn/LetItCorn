const mariadb = require("../database/mapper.js");
const { convertObjToAry, convertObjToQuery  } = require('../utils/converts.js');

const findQcLog = async (searchList) => {
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : 
  '';
    let list = await mariadb.query("selectQcLog", searchKeyword);
    return list;
   };
   const findByQcLog = async (pqcNo) => {
     let list = await mariadb.query("selectQcLogOne", pqcNo);
     let info = list[0];
     return info;
    };

    const addNewQcLog = async (pqcInfo) => {
      let insertColumns = ['lot_cnt', 'p_log_no', 'sta_time', 'end_time', 'ac_cnt', 'fault_cnt', 'pr_log_etc', 'process_code', 'process_name', 'processer'];
      let data = convertObjToAry(pqcInfo, insertColumns);
      let resInfo = await mariadb.query("QcLogInsert", data);
      let result = null;
      if (resInfo.insertId > 0) {
        result = {
          isSuccessed: true,
          pqcNo: resInfo.insertId,
        };
      } else {
        result = {
          isSuccessed: false,
        };
      }
      return result;
     };

const modifyQcLog = async (pqcNo, pqcInfo) => {
  let data = [pqcInfo, pqcNo];
  let resInfo = await mariadb.query("QcLogUpdate", data);
  
  let result = null;
  if (resInfo.affectedRows > 0) {
    pqcInfo.no = pqcNo;
    result = {
      isUpdated: true,
      pqcInfo,
    };
  } else {
    result = {
      isUpdated: false,
    };
  }
  return result;
 };

 const removeQcLog = async (pqcNo) => {
   let result = await mariadb.query("QcLogDelete", pqcNo);
   return result;
  };

  module.exports ={
    findQcLog,
    findByQcLog,
    addNewQcLog,
    modifyQcLog,
    removeQcLog,
  }