const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');
const loginByUserId = async (loginInfo) => {
  let list = await mariadb.query("findUserByUserId", loginInfo.id);
  let userInfo = null;
    if(list.length == 1){
    // 해당 회원의 정보가 존재하는 경우
  let info = list[0];
    if(info.password == loginInfo.pwd){
    // 테이블에 등록된 회원의 비밀번호와 입력받은 비밀번호가 같은 경우 userInfo = info;
    }
  } return {
    result : userInfo != null,
    userInfo,
  };
};

module.exports = {
  loginByUserId,
}