const convertObjToAry = (target, selected) => {
  let aray = [];
    for(let fieldName of selected){
      let fieldVal = target[fieldName];
        aray.push(fieldVal);
    }
    return aray;
};

const convertObjToQuery = (target, selected = []) => {
  let fields = Object.keys(target);
  let queryWhere = 'AND ';
    for(let i = 0; i < fields.length; i++){
        let columnName= fields[i];
        let columnValue = target[columnName];
                     // 컬럼명        = '조건값'          AND(혹은 OR) 
        queryWhere += `${columnName} = '${columnValue}' ${selected[i] ?? ''}`
      }
      return { serchKeyword : queryWhere };
  }
const queryFormat = function (query, values) {
  let rewriteQuery = query.replace(/\:(\w+)/g, function (txt, key) {
    if (values.hasOwnProperty(key)) {
      let convertvalue = values[key];
      delete values[key];
      return convertvalue;
    }else{
      return '';
    }
  });
  return rewriteQuery;
};

module.exports = {
  convertObjToAry,
  convertObjToQuery,
  queryFormat,
}