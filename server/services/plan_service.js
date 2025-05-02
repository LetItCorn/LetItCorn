const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');
const dayjs = require('dayjs');

const findByPlan = async (planNo) => {
     let list = await mariadb.query("selectPlansOne", planNo);
     return list;
    };

const addNewPlan = async (planInfo) => {
  const today = dayjs().format('YYMMDD')
  const planNo = `PPN${today}01`   
  planInfo.plan_no = planNo        
  planInfo.plans_head = `PPHN${today}01` 

  let insertColumns = ['plan_no', 'plans_head', 'porder_seq', 'item_no', 'plans_vol', 'delivery_date', 'item_name']
  let data = convertObjToAry(planInfo, insertColumns)

  let resInfo = await mariadb.query("plansInsert", data)

  await mariadb.query(`
    UPDATE salesorder SET status = '계획됨' WHERE sorder_code = ?
  `, [planInfo.porder_seq])

  return {
    isSuccessed: resInfo.affectedRows > 0,
    planNo: planInfo.plan_no,
    rawResult: resInfo
  }
}

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
