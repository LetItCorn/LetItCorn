const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');

const findByInst = async (instNo) => {
     let list = await mariadb.query("selectInst", instNo);
     let info = list[0];
     return info;
    };
const addNewInst = async (instInfo) => {
      let insertColumns = ['inst_no', 'lot_cnt', 'plans_vol', 'iord_no', 'process_header', 'inst_head', 'item_code', 'out_od'];
      let data = convertObjToAry(instInfo, insertColumns);
      let resInfo = await mariadb.query("insertInst", data);
      let result = null;
      if (resInfo.insertId > 0) {
        result = {
          isSuccessed: true,
          instNo: resInfo.insertId,
        };
      } else {
        result = {
          isSuccessed: false,
        };
      }
      return result;
     };
  
const modifyInst = async (instNo, instInfo) => {
  let data = [instInfo, instNo];
  let resInfo = await mariadb.query("updateInst", data);
  
  let result = null;
  if (resInfo.affectedRows > 0) {
    instInfo.no = instNo;
    result = {
      isUpdated: true,
      instInfo,
    };
  } else {
    result = {
      isUpdated: false,
    };
  }
  return result;
 };

 const removeInst = async (instNo) => {
   let result = await mariadb.query("deleteInst", instNo);
   return result;
  };

module.exports = {
  findByInst,
  addNewInst,
  modifyInst,
  removeInst,
}
