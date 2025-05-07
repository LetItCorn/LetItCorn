const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');
const { convertObjToQuery } = require('../utils/converts.js');

// 전체조회 관련 service 예제입니다. 본인파트 crud 기준으로 추가.변경 하셔야합니다. 
const findAllPlans = async (searchList) => {
  const { startDate, endDate } = searchList;

  const list = await mariadb.query("selectPlanHeaderList", [startDate, endDate]);
  return list;
};
const findByPlans = async (plansNo) => {
     let list = await mariadb.query("selectPlanDetailByHead",[plansNo]);
     return list;
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
  modifyPlans,
  removePlans,
}
