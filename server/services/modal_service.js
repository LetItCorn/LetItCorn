const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');

const findBySorder = async (ordNo) => {
     let list = await mariadb.query("selectOrder", ordNo);
     return list;
    };
 const findByDateRange = async (type, startDate, endDate) => {
      console.log("검색 날짜:", startDate, endDate);       
      let alias = type === '작성일자' ? 'selectByWriteDate' : 'selectByEndDate';
      console.log("검색 날짜:", startDate, endDate)
      let range = await mariadb.query(alias, [startDate, endDate])
      return range;
    };

module.exports = {
  findBySorder,
  findByDateRange,
}