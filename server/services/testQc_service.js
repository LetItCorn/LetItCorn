//품질검사
const mariadb = require("../database/mapper.js");
const { convertObjToAry, convertObjToQuery  } = require('../utils/converts.js');
 
const findTest = async (searchList) => {
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : 
  '';
    let list = await mariadb.query("selectTest", searchKeyword);
    return list;
   };

   const findByTestQc = async (testNo) => {
     let list = await mariadb.query("selectTestOne", [testNo])
                              .catch(err => console.log(err));
     let info = list[0];
     return info;
    };

    const addNewTest = async (testInfo) => {
      let insertColumns = ['test_feild', 'test_res', 'test_stat', 'test_etc', 'test_stand'];
      let data = convertObjToAry(testInfo, insertColumns);
      let resInfo = await mariadb.query("testInsert", data);
      let result = null;
      if (resInfo.insertId > 0) {
        result = {
          isSuccessed: true,
          testNo: resInfo.insertId,
        };
      } else {
        result = {
          isSuccessed: false,
        };
      }
      return result;
     };

const modifyTestInfo = async (testNo, testInfo) => {
  let data = [testInfo, testNo];
  let resInfo = await mariadb.query("testUpdate", data);
  
  let result = null;
  if (resInfo.affectedRows > 0) {
    testInfo.no = testNo;
    result = {
      isUpdated: true,
      testInfo,
    };
  } else {
    result = {
      isUpdated: false,
    };
  }
  return result;
 };

 const removeTestInfo = async (testNo) => {
   let result = await mariadb.query("testDelete", testNo);
   return result;
  };
 
  module.exports = {
    findTest,
    findByTestQc,
    addNewTest,
    modifyTestInfo,
    removeTestInfo,
  }