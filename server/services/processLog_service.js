//공정 (process.service)
const mariadb = require("../database/mapper.js");
const { callResult } = require("../database/sqlList.js");
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
// 진행하지 않은 생산지시 호출
 const getinst = async()=>{
  let result = await mariadb.query("selectInst")
  return result;
 }
// 선택한 생산 지시의 공정흐름 호출
const getFlow = async(item)=>{
  let result = await mariadb.query('getFlow', item);  
  return result;
}

const regProLog = async(data)=>{
  let conn;
  let res;
  let dtRes;
  console.log(data);
  // 첫등록시 공정실적을 생성하기위해 필요한 데이터
  firstIncome = ['process_header','item_name','userId','item_code','iord_no','inst_head']
  // 공정실적디테일을 등록하기 위한 데이터 
  afterFirst =['lot_cnt','pr_log_no','sta_time','end_time','ac_cnt','fault_cnt','process_code','process_name','userId','spec','unit_code']
  // 지시의 수정을 위한 데이터
  updateHead = ['ac_cnt','lot_cnt']
  try{
    conn = await mariadb.getConnection();
    console.log(data.sequence_order)
    if(data.sequence_order == 1){
      let firstProcess = convertObjToAry(data,firstIncome)
      console.log(firstProcess);
      //실제 sql문을 가지고 오는 작업
      selectSql = await mariadb.selectedQuery('setResult')
      // 해당 connection을 기반으로 실제 sql문을 실행
      let list = await conn.query(selectSql);
      selectSql = await mariadb.selectedQuery('regProLog',firstProcess)
      let reg = await conn.query(selectSql)
      // console.log(reg);
      selectSql = await mariadb.selectedQuery('callResult')
      res = await conn.query(selectSql)
      let regData = convertObjToAry(data, afterFirst)
      selectSql = await mariadb.selectedQuery('regProLogDt',regData)
      dtRes = await conn.query(selectSql)
      Object.assign(res.dtRes)
    }else if(data.sequence_order == data.flowLength){
      let regData = convertObjToAry(data, afterFirst)
      selectSql = await mariadb.selectedQuery('regProLogDt',regData)
      res = await conn.query(selectSql)
      let updated = convertObjToAry(data, updateHead)
      selectSql = await mariadb.selectedQuery('setInst',updated)
      dtRes = await conn.query(selectSql)
    }else{
      let regData = convertObjToAry(data, afterFirst)
      selectSql = await mariadb.selectedQuery('regProLogDt',regData)
      res = await conn.query(selectSql)
    }
    await conn.beginTransaction();

    conn.commit();

  }catch(err){
    if(conn) conn.rollback();
  }finally{
    if(conn) conn.release();
  }
  return res
}

 module.exports = {
  findProcess,
  findByProcessLog,
  addNewPrLog,
  modifyPrLogInfo,
  removePrLogInfo,
  getinst,
  getFlow,
  regProLog
 };