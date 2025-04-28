const mariadb = require("../database/mapper.js");
const { convertObjToAry, convertObjToQuery  } = require('../utils/converts.js');

const findDetails = async (searchList) => {
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : 
  '';
    let list = await mariadb.query("selectDetails", searchKeyword);
    return list;
   };
   const findByDetails = async (detailNo) => {
     let list = await mariadb.query("selectDetailsOne", detailNo);
     let info = list[0];
     return info;
    };

    const addNewDetails = async (detailInfo) => {
      let insertColumns = ['lot_cnt', 'p_log_no', 'sta_time', 'end_time', 'ac_cnt', 'fault_cnt', 'pr_log_etc', 'process_code', 'process_name', 'processer'];
      let data = convertObjToAry(detailInfo, insertColumns);
      let resInfo = await mariadb.query("detailsInsert", data);
      let result = null;
      if (resInfo.insertId > 0) {
        result = {
          isSuccessed: true,
          detailNo: resInfo.insertId,
        };
      } else {
        result = {
          isSuccessed: false,
        };
      }
      return result;
     };

const modifyDetails = async (detailNo, detailInfo) => {
  let data = [detailInfo, detailNo];
  let resInfo = await mariadb.query("detailsUpdate", data);
  
  let result = null;
  if (resInfo.affectedRows > 0) {
    detailInfo.no = detailNo;
    result = {
      isUpdated: true,
      detailInfo,
    };
  } else {
    result = {
      isUpdated: false,
    };
  }
  return result;
 };

 const removeDetails = async (detailNo) => {
   let result = await mariadb.query("detailsDelete", detailNo);
   return result;
  };

  module.exports ={
    findDetails,
    findByDetails,
    addNewDetails,
    modifyDetails,
    removeDetails,
  }