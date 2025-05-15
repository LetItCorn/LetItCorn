//공정 (process.service)
const mariadb = require("../database/mapper.js");
const { callResult } = require("../database/sqlList.js");
const { convertObjToAry, convertObjToQuery  } = require('../utils/converts.js');
 
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
// 공정실적 저장 트랜젝션
const regProLog = async(data)=>{
  let conn;
  let res;
  let dtRes;
  console.log(data);
  // 첫등록시 공정실적을 생성하기위해 필요한 데이터
  firstIncome = ['process_header','item_name','userId','item_code','iord_no','inst_head']
  // 공정실적디테일을 등록하기 위한 데이터 
  afterFirst =['lot_cnt','p_log_no','sta_time','end_time','ac_cnt','fault_cnt','process_code','process_name','userId','spec','unit_code']
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
      // process_log 등록 
      let reg = await conn.query(selectSql,firstProcess)
      selectSql = await mariadb.selectedQuery('callResult')
      // pr_log_no 반환
      res = await conn.query(selectSql)
      console.log(res);
      // 데이터 객체에 pr_log_no 통합
      Object.assign(data,res[0])
      let regData = convertObjToAry(data, afterFirst)
      // 세부 공정 기입
      selectSql = await mariadb.selectedQuery('regProLogDt',regData)
      dtRes = await conn.query(selectSql,regData)
      Object.assign(res,dtRes[0])
    }else if(data.sequence_order == data.flowLength){
      //마지막 공정 실적 저장시 지시 테이블 업데이트
      let regData = convertObjToAry(data, afterFirst)
      selectSql = await mariadb.selectedQuery('regProLogDt',regData)
      res = await conn.query(selectSql,regData)
      let updated = convertObjToAry(data, updateHead)
      selectSql = await mariadb.selectedQuery('setInst',updated)
      dtRes = await conn.query(selectSql,updated)
    }else{
      // 일반 공정 실적 저장
      let regData = convertObjToAry(data, afterFirst)
      selectSql = await mariadb.selectedQuery('regProLogDt',regData)
      res = await conn.query(selectSql,regData)
    }
    await conn.beginTransaction();
    
    conn.commit();
    
  }catch(err){
    if(conn) conn.rollback();
  }finally{
    if(conn) conn.release();
  }
  return data
}

// 해당 공정의 품질검사 정보 조회
const getQcTest = async(data)=>{
  let res = await mariadb.query('getQcTest',data)
  .catch(err=>{
    console.log(err);
  });
  return res
}

// 품질 검사 이력 저장 프로시저 실행
const regQcLog = async(data)=>{
  let selected = ['process_code','item_code','userId','test_res','lot_cnt','unit','test_res']
  let rows=0;
  for(eachData of data){
  let dataAry = convertObjToAry(eachData,selected)
  let res = await mariadb.query('regQcLog',dataAry)
                        .catch(err=>{
                          console.log(err);
                        })
                        console.log(res);
  rows += res.affectedRows
  }
 
  console.log(rows);
  return rows
}

 module.exports = {
  getinst,
  getFlow,
  regProLog,
  getQcTest,
  regQcLog
 };