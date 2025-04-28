// 조건없이 품목 전체조회
const selectItemList =
`SELECT item_code
        , item_name
        , item_type
        , unit_code
        , spec
    FROM items
    ORDER BY item_code`;

module.exports ={
  selectItemList
 };