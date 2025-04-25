const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');

// 전체조회 관련 service 예제입니다. 본인파트 crud 기준으로 추가.변경 하셔야합니다. 
const findAll = async () => {
  let list = await mariadb.query("selectBookList")
                          .catch(err => console.log(err));
  return list;
};


module.exports = {
  findAll,
}