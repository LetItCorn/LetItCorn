//공정 (process.service)
const mariadb = require("../database/mapper.js");
const { convertObjToAry, convertObjToQuery  } = require('../utils/converts.js');
 
// 다양한 조건을 기반으로 한 리뷰조회
 const findProcess = async (searchList) => {
  // 검색정보가 넘어온 경우 
  // SQL문에 반영하기 위해 문자열로 변환하는 함수 호출
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : 
'';
  let list = await mariadb.query("selectProcessLog", searchKeyword);
  return list;
 };
 // PRIMARY KEY인 no을 기반으로 한 단건조회
 const findByProcessLog = async (processLog) => {
  let list = await mariadb.query("selectPrLogOne", [processLog]);
  let info = list[0];
  return info;
 };
 // 새로운 리뷰 등록
const addNewPrLog = async (prLogInfo) => {
  let insertColumns = ['log_dt', 'process_head', 'item_name', 'emp_id', 'inst_head', 'item_code', 'iord_no'];
  let data = convertObjToAry(prLogInfo, insertColumns);
  let resInfo = await mariadb.query("prLogInsert", data);
  let result = null;
  if (resInfo.insertId > 0) {
    result = {
      isSuccessed: true,
      pLogNo: resInfo.insertId,
    };
  } else {
    result = {
      isSuccessed: false,
    };
  }
  return result;
 };
 // 기존 리뷰 수정
const modifyPrLogInfo = async (pLogNo, prLogInfo) => {
  let data = [prLogInfo, pLogNo];
  let resInfo = await mariadb.query("prLogUpdate", data);
  
  let result = null;
  if (resInfo.affectedRows > 0) {
    prLogInfo.no = pLogNo;
    result = {
      isUpdated: true,
      prLogInfo,
    };
  } else {
    result = {
      isUpdated: false,
    };
  }
  return result;
 };
 // 기존 리뷰 삭제
const removePrLogInfo = async (pLogNo) => {
  let result = await mariadb.query("prLogDelete", pLogNo);
  return result;
 };

 module.exports = {
  findProcess,
  findByProcessLog,
  addNewPrLog,
  modifyPrLogInfo,
  removePrLogInfo,
 };