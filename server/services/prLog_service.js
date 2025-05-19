const mariadb = require("../database/mapper.js");
const { convertObjToAry, convertObjToQuery  } = require('../utils/converts.js');

const getPrLog = async () => {
  let result = await mariadb.query('getPrLog')
                            .catch((err) => {
                              console.log(err);
                            })
  return result;
}

const getPrLogDt = async (data) => {
  let result = await mariadb.query('getPrLogDt', data)
                            .catch((err) => {
                              console.log(err);
                            })
  return result;
}


module.exports = {
  getPrLog,
  getPrLogDt
}
