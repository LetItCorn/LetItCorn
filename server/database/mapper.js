  const mariadb = require('mariadb/callback');
  const sqlList = require('./sqlList.js');
  const { queryFormat  } = require('../utils/converts.js');
  const connectionPool = mariadb.createPool({
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PWD,
    database : process.env.DB_DB,
    connectionLimit : process.env.DB_LIMIT,
    permitSetMultiParamEntries : true,
    insertIdAsNumber : true,
    bigIntAsNumber : true,
    logger : {
      query : console.log,
      error : console.log,
    }
  });

  const query = (alias, values)=>{
    return new Promise((resolve, reject)=>{
      let executeSql = queryFormat(sqlList[alias], values);
      connectionPool.query(executeSql, values, (err, results)=>{
        if(err) {
          reject({err});
        }else{
          resolve(results);
        }
      });
    });
  };

  module.exports = {
    query,
  }