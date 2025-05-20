const mariadb = require('../database/mapper.js');
const { convertObjToAry, convertObjToQuery  } = require('../utils/converts.js');

const getQcList = async (searchList) =>{
  console.log(searchList.test_no);
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : '';
  console.log(searchKeyword);
  let result = await mariadb.query('getQcList',searchKeyword)
                            .catch(err=>{
                              console.log(err);
                            })
  return result
}

module.exports ={
  getQcList,
}