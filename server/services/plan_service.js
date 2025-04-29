const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');

const findByPlan = async (planNo) => {
     let list = await mariadb.query("selectPlansOne", planNo);
     let info = list[0];
     return info;
    };
const addNewPlan = async (planInfo) => {
      let insertColumns = ['plans_head', 'plan_start', 'plan_end', 'plan_stat', 'plans_reg', 'planer'];
      let data = convertObjToAry(planInfo, insertColumns);
      let resInfo = await mariadb.query("plansInsert", data);
      let result = null;
      if (resInfo.insertId > 0) {
        result = {
          isSuccessed: true,
          planNo: resInfo.insertId,
        };
      } else {
        result = {
          isSuccessed: false,
        };
      }
      return result;
     };
  
const modifyPlan = async (planNo, planInfo) => {
  let data = [planInfo, planNo];
  let resInfo = await mariadb.query("plansUpdate", data);
  
  let result = null;
  if (resInfo.affectedRows > 0) {
    planInfo.no = planNo;
    result = {
      isUpdated: true,
      planInfo,
    };
  } else {
    result = {
      isUpdated: false,
    };
  }
  return result;
 };

 const removePlan = async (planNo) => {
   let result = await mariadb.query("plansDelete", planNo);
   return result;
  };

module.exports = {
  findByPlan,
  addNewPlan,
  modifyPlan,
  removePlan,
}
