const convertObjToAry = (target, selected) => {
  let aray = [];
  // selected에 변화시키고자하는 객체(tartget)의  key 값을 배열로 넣어주면
    for(let fieldName of selected){
  // for of 문에서 배열 크기만큼 반복문을 실행하면서
  // key값을 대괄호 표기법에 넣어 target의 일치하는 값을 변수에 담아준다
      let fieldVal = target[fieldName];
  // 반환하는 배열에 하나씩 담아준다.    
        aray.push(fieldVal);
    }
    return aray;
};

const convertObjToQuery = (target, selected = []) => {
  // 객체의 key 를 배열로 반환해주는 Object.keys 메소드를 이용해 필드 배열을 만든다
  let fields = Object.keys(target);
  // where 1=1 문 아래에 :searchKeyword 의 값을 입력하기위한 AND문 작성
  let queryWhere = 'AND ';
    for(let i = 0; i < fields.length; i++){
      // 객체의 key 와 value 를 where 절 조건문의 형식에 맞게  key = value   (AND 혹은 OR) 형식으로 만드는 for문 
        let columnName= fields[i];
        let columnValue = target[columnName];
                     // 컬럼명        = '조건값'          AND(혹은 OR) selected값이 있으면 그 값, 없으면 ''을 넣겠다 
        queryWhere += `${columnName} = '${columnValue}' ${selected[i] ?? ''}`
      }
      // 완성되 where 절의 조건을 객체 형식으로 반환.
      return { serchKeyword : queryWhere };
  }


const convertObjToQueryLike = (target, selected = []) => {
  // target : 검색 정보를 가지고 있는 객체, { 컬럼명 : 검색값, 컬럼명 : 검색값 }
  // selected : 각 검색조건을 연결할 AND 와 OR을 순서대로 가지고 있는 배열
  // 검색 조건으로 사용될 컬럼명(Object의 key)를 배열로 가져옴
  let fields = Object.keys(target);
  // WHERE 1=1 다음에 추가할 검색 조건 시작, 1=1 참을 의미
  let queryWhere = 'AND ';
  for (let i = 0; i < fields.length; i++) {
      let columnName = fields[i];
      let columnValue = target[columnName];
      // LIKE 조건을 삽입해 비슷한 값 모두를 조회
      // 컬럼명        = '조건값'          AND(혹은 OR) 
      queryWhere += `${columnName} LIKE '%${columnValue}%' ${selected[i] ?? ''}`
      // ?? : 변수의 값이 null이거나 undefined 일 경우 기본값을 설정
  }
  // SQL문 사용된 문자열(searchKeyword)에 해당 결과를 매핑해서 전달
  return {
      searchKeyword: queryWhere
  };
}

// SELECT * FROM test WHERE 1=1 :searchKeyword; 
const queryFormat = function (query, values) {
  // query  : SQL문
  // values : 대체값
  // SQL문에 :(콜론)으로 시작하는 문자열을 찾아 사용자가 선택한 값으로 대체
  let rewriteQuery = query.replace(/\:(\w+)/g, function (txt, key) {
      // 대체값 중 SQL문에 사용된 :문자열에 해당 하는 값이 있을 경우 변경
      if (values.hasOwnProperty(key)) {
          let convertvalue = values[key];
          // 적용된 객체의 속성을 삭제
          delete values[key];
          return convertvalue;
      } else {
          // 없을 경우 :문자열을 ''(공백)으로 대체해서 완성된 SQL문으로 반환
          return '';
      }
  });
  // 다시 작성된 SQL문을 반환
  return rewriteQuery;
};
// 키는 3종류

module.exports = {
  convertObjToAry,
  convertObjToQuery,
  queryFormat,
  convertObjToQueryLike
}