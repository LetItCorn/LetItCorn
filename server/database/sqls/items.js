// server/database/sqls/items.js

// 1) 전체 조회
const itemList = `
  SELECT item_code
       , item_name
       , item_type    -- 코드값으로 저장됨 (C01, C02, C03)
       , unit_code    -- 코드값으로 저장됨 (U01, U02, U03)
       , spec
  FROM items
  ORDER BY item_code
`;

// 2) 단건 조회 (품목코드 기준)
const itemInfo = `
  SELECT item_code
       , item_name
       , item_type
       , unit_code
       , spec
  FROM items
  WHERE item_code = ?
`;

// 5) 등록 (insert)
const itemInsert = `
  INSERT INTO items (item_code, item_name, item_type, unit_code, spec)
  VALUES (?, ?, ?, ?, ?)
`;

module.exports = {
  itemList,
  itemInfo,
  itemInsert,
};
