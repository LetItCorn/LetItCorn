const mariadb =require("../database/mapper.js");
const {convertObjToAry}=require('../utils/converts.js');

// 조건없이 품목 전체조회
const findAll = async() =>{
  let list =await mariadb.query("selectItemList")
  .catch(err =>console.log(err));
  return list;
};

module.exports ={
  findAll,
};