const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');
const { convertObjToQuery } = require('../utils/converts.js');

// 전체조회 관련 service 예제입니다. 본인파트 crud 기준으로 추가.변경 하셔야합니다. 
const findAllPlans = async (searchList) => {
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : 
  '';
    let list = await mariadb.query("selectPlanHeaderList", searchKeyword);
    return list;
   };
const findByPlans = async (plansNo) => {
     let list = await mariadb.query("selectPlanHeaderOne", plansNo);
     let info = list[0];
     return info;
    };
const addNewPlans = async (plansInfo) => {
      let insertColumns = ['plans_head', 'plan_start', 'plan_end', 'plan_stat', 'plans_reg', 'planer'];
      let data = convertObjToAry(plansInfo, insertColumns);
      let resInfo = await mariadb.query("insertPlanHeader", data);
      let result = null;
      if (resInfo.insertId > 0) {
        result = {
          isSuccessed: true,
          plansNo: resInfo.insertId,
        };
      } else {
        result = {
          isSuccessed: false,
        };
      }
      return result;
     };
  
const modifyPlans = async (plansNo, plansInfo) => {
  let data = [plansInfo, plansNo];
  let resInfo = await mariadb.query("updatePlanHeader", data);
  
  let result = null;
  if (resInfo.affectedRows > 0) {
    plansInfo.no = plansNo;
    result = {
      isUpdated: true,
      plansInfo,
    };
  } else {
    result = {
      isUpdated: false,
    };
  }
  return result;
 };

 const removePlans = async (plansNo) => {
   let result = await mariadb.query("deletePlanHeader", plansNo);
   return result;
  };

module.exports = {
  findAllPlans,
  findByPlans,
  addNewPlans,
  modifyPlans,
  removePlans,
}
