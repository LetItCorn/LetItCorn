const mariadb = require('../database/mapper.js');
const { convertObjToAry, convertObjToQuery  } = require('../utils/converts.js');

const getQcList = async (searchList) =>{
  console.log(searchList.test_no);
  let searchKeyword = Object.keys(searchList).length > 0 ? convertObjToQuery(searchList) : '';
  console.log(searchKeyword);
  let result = await mariadb.query('getQcList',searchKeyword)
                            .catch(err=>{
                              console.log(err);
                            })
  return result
}
const getOptions = async () =>{
  let result = await mariadb.query('getOptions')
                            .catch(err=>{
                              console.log(err);
                            })
  return result
}
const mergeQcData = async (data) =>{
  const sortData = ['test_no','test_feild','test_stand','test_target','unit_name']
  let sortedData = convertObjToAry(data,sortData)
  
  let result = await mariadb.query('setQc',sortedData)
                            .catch(err=>{
                              console.log(err);
                            })

  return result
}

const delQc = async (data) =>{
  const result = await mariadb.query('delQc',data)
                              .catch(err=>{
                                console.log(err);
                              })
  return result
}

module.exports ={
  getQcList,
  getOptions,
  mergeQcData,
  delQc,

}