const mariadb = require("../database/mapper.js");

const selectByPlanList = async (startDate, endDate) => {
  let params = [startDate,startDate, endDate, endDate];
  return await mariadb.query("selectPlanList", params);;
}

module.exports = {
  selectByPlanList,
}