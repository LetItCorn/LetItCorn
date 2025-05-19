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
  let result;
  console.log(data);
  // 첫등록시 공정실적을 생성하기위해 필요한 데이터
  let firstIncome = ['process_header','item_name','userId','item_code','iord_no','inst_head']
  // 공정실적디테일을 등록하기 위한 데이터 
  let afterFirst =['lot_cnt','p_log_no','sta_time','end_time','ac_cnt','fault_cnt','process_code','process_name','userId','spec','unit_code']
 
  try{
    conn = await mariadb.getConnection();
    await conn.beginTransaction();
    // console.log(data.sequence_order)
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
    // }else if(data.sequence_order == data.flowLength){
    //   //마지막 공정 실적 저장시 지시 테이블 업데이트
    //   let regData = convertObjToAry(data, afterFirst)
    //   selectSql = await mariadb.selectedQuery('regProLogDt',regData)
    //   res = await conn.query(selectSql,regData)
    //   let updated = convertObjToAry(data, updateHead)
    //   selectSql = await mariadb.selectedQuery('setInst',updated)
    //   dtRes = await conn.query(selectSql,updated)
    }else{
      // 일반 공정 실적 저장
      let regData = convertObjToAry(data, afterFirst)
      selectSql = await mariadb.selectedQuery('regProLogDt',regData)
      res = await conn.query(selectSql,regData)
    }
    
    conn.commit();
    data.result = 'success'
  }catch(err){
    if(conn) conn.rollback();
    data.result = 'fail'
  }finally{
    if(conn) conn.release();
    return data
  }
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
  let selected = ['process_code','item_code','userId','test_res','lot_cnt','unit','pr_status']
  let rows=0;
  let conn ; 
  let res
  let updateHead = ['ac_cnt','inst_no']
  try {
    conn = await mariadb.getConnection()
    await conn.beginTransaction()
     // 지시의 수정을 위한 데이터
    // console.log(data[0].sequence_order);
    // console.log(data[0].flowLength);
    // console.log(data[0].sequence_order === data[0].flowLength);
    if(data[0].sequence_order === data[0].flowLength){
      for(eachData of data){
        let dataAry = convertObjToAry(eachData,selected)
        selectSql = await mariadb.selectedQuery('regQcLog',dataAry)
        let res = await conn.query(selectSql,dataAry)
        rows += res.affectedRows
        }
        let updated = convertObjToAry(data[0], updateHead)
          selectSql = await mariadb.selectedQuery('setInst',updated)
          let dtRes = await conn.query(selectSql,updated)
    }else{
      for(eachData of data){
        let dataAry = convertObjToAry(eachData,selected)
        selectSql = await mariadb.selectedQuery('regQcLog',dataAry)
        console.log(selectSql);
        let res = await conn.query(selectSql,dataAry)
        rows += res.affectedRows
        }
    }
     
    conn.commit();
    return rows
  } catch (error) {
    if(conn) conn.rollback();
  }finally{
    if(conn) conn.release();
  }
}

const updateInHead = async (data) => {
  console.log(data);
  let upData = []
  upData.push(data)
  let result = await mariadb.query('updateInHead',upData)
                            .catch(err=>{
                              console.log(err);
                            })
  return result
}

 module.exports = {
  getinst,
  getFlow,
  regProLog,
  getQcTest,
  regQcLog,
  updateInHead
 };