// 테이블 : t_prod_01

// 각 변수별로 SQL문을 등록할 떄 백틱(``)을 사용하는 이유는 줄바꿈 허용을 허용하기 떄문.
// ( 따옴표는 줄을 바꿀 경우 값이 깨지면서 에러발생 )

// 조건없이 전체조회
const selectProductList =
`SELECT no
		    , name
        , key2
        , condition
        , ord_date
        , info         
FROM t_prod_01
ORDER BY no`;

module.exports = {
  selectProductList,
}