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

  const deleteInstCascade = async (instHeadNo) => {
    const conn = await mariadb.getConnection();
    try {
      await conn.beginTransaction();  
      // 1. 하위 inst 먼저 삭제
      await conn.query(`DELETE FROM inst WHERE inst_head = ?`, [instHeadNo]);  
      // 2. 상위 inst_header 삭제
      const result = await conn.query(
        `DELETE FROM inst_header WHERE inst_head = ? AND inst_stat = 'J01'`,
        [instHeadNo]
      );  
      await conn.commit();
      return result;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  };

module.exports = {
  findAllInstHead,
  findByInstHead,
  modifyInstHead,
  removeInstHead,
  deleteInstCascade,
}
