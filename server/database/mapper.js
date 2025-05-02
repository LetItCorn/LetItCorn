  // MariaDB에 접속할 모듈
  // const mariadb = require('mariadb/callback');

  const mariadb = require('mariadb');
  // DB에서 실행할 SQL문을 별도 파일로 작성
  const sqlList = require('./sqlList.js');
  const { queryFormat  } = require('../utils/converts.js');

  //DB에 접속하는 정보를 하드코딩하지 않고 
  //별도 env파일로 처리
  // => 내장모듈인 process 모듈의 env 속성으로 접근
  const connectionPool = mariadb.createPool({
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PWD,
    database : process.env.DB_DB,
    connectionLimit : process.env.DB_LIMIT,

    // Object의 필드정보를 Query문에 있는 '?'에 자동변환 설정
    permitSetMultiParamEntries : true,
    // DML(insert, update, delete)를 실행할 경우
    // 반환되는 Object의 insertId 속성을 Number 타입으로 자동 변환
    insertIdAsNumber : true,
    //MariaDB의 데이터 타입 중 bigInt 타입을 javascript의 Number 타입으로 자동변환
    bigIntAsNumber : true,
    //logger 등록 
    logger : {
      // 실제 실행되는 SQL문이 console.log로 출력되도록 설정
      query : console.log,
      // error 발생 시 처리함수
      error : console.log,
    }
  });

  // MariaDB에 SQL문을 보내고 결과를 받아올 함수 설정
  let query = (alias, values)=>{
    return new Promise((resolve, reject)=>{
      let executeSql = queryFormat(sqlList[alias], values);
      connectionPool.query(executeSql, values, (err, results)=>{
        if(err) {
          reject({err});
        }else{
          resolve(results);
        }
      });
    })
     // 프로미스 안에서 에러가 나면 이걸 .catch로 보내서 에러처리함.
  .catch(err => {
    console.log(err);
    return err;
  })
  };

  //일반 쿼리 
  query = async (alias, values) => {
    try{
      let executeSql = queryFormat(sqlList[alias], values);
      let result = await connectionPool.query(executeSql, values);
      return result;
    }catch(err){
      console.log(err);
      return err;
    }
  };
  
  // 트랜젝션 열고 닫기를 편리하게 하기위해서 작성.
  const getConnection = async () => await connectionPool.getConnection() ;
  const selectedQuery = (alias, values) => queryFormat(sqlList[alias], values) ;
  
  module.exports = {
    query,
    getConnection,
    selectedQuery,
  }
  
  
  
  
  
  
  