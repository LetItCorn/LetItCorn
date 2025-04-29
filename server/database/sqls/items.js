// server/database/sqls/items.js

// 1) 전체 조회
const selectItemList = `
  SELECT item_code
       , item_name
       , item_type    -- 코드값으로 저장됨 (C01, C02, C03)
       , unit_code    -- 코드값으로 저장됨 (U01, U02, U03)
       , spec
  FROM items
  ORDER BY item_code
`;

// 2) 단건 조회 (품목코드 기준)
const selectItemOne = `
  SELECT item_code
       , item_name
       , item_type
       , unit_code
       , spec
  FROM items
  WHERE item_code = ?
`;

// 3) 이름 검색 (품목명 기준)
const selectItemByName = `
  SELECT item_code
       , item_name
       , item_type
       , unit_code
       , spec
  FROM items
  WHERE item_name LIKE CONCAT('%', ?, '%')
  ORDER BY item_code
`;

// 4) 구분 검색 (item_type 코드 기준)
const selectItemByType = `
  SELECT item_code
       , item_name
       , item_type
       , unit_code
       , spec
  FROM items
  WHERE item_type = ?
  ORDER BY item_code
`;

// 5) 등록 (insert)
const insertItem = `
  INSERT INTO items (item_code, item_name, item_type, unit_code, spec)
  VALUES (?, ?, ?, ?, ?)
`;

// 6) 수정 (update)
const updateItem = `
  UPDATE items
  SET item_name = ?
    , item_type = ?
    , unit_code = ?
    , spec      = ?
  WHERE item_code = ?
`;

// 7) 삭제 (delete)
const deleteItem = `
  DELETE FROM items
  WHERE item_code = ?
`;

module.exports = {
  selectItemList,
  selectItemOne,
  selectItemByName,
  selectItemByType,
  insertItem,
  updateItem,
  deleteItem
};
