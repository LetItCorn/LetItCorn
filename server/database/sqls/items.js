// server/database/sqls/items.js

// 1) 전체 조회 + 조건별 검색 (code, name, type 모두 옵션)
const itemList = `
  SELECT item_code
       , item_name
       , item_type    -- 코드값으로 저장됨 (C01, C02, C03)
       , unit_code    -- 코드값으로 저장됨 (U01, U02, U03)
       , spec
  FROM items
  WHERE 1=1
    AND (? = '' OR item_code LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR item_name LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR item_type = ?)
  ORDER BY item_code
`;

// 1-a) 분리 조회: 코드로만 조회
const itemListByCode = `
  SELECT item_code, item_name, item_type, unit_code, spec
  FROM items
  WHERE item_code LIKE CONCAT('%', ?, '%')
  ORDER BY item_code
`;

// 1-b) 분리 조회: 명칭으로만 조회
const itemListByName = `
  SELECT item_code, item_name, item_type, unit_code, spec
  FROM items
  WHERE item_name LIKE CONCAT('%', ?, '%')
  ORDER BY item_code
`;

// 1-c) 분리 조회: 타입(구분)으로만 조회
const itemListByType = `
  SELECT item_code, item_name, item_type, unit_code, spec
  FROM items
  WHERE item_type = ?
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

// 3) 등록 (Insert)
const itemInsert = `
  INSERT INTO items (item_code, item_name, item_type, unit_code, spec)
  VALUES (?, ?, ?, ?, ?)
`;

// 4) 수정 (Update)
const itemUpdate = `
  UPDATE items
     SET item_name = ?
       , item_type = ?
       , unit_code = ?
       , spec      = ?
   WHERE item_code = ?
`;

// 5) 삭제 (Delete)
const itemDelete = `
  DELETE FROM items
   WHERE item_code = ?
`;

module.exports = {
  itemList,
  itemListByCode,
  itemListByName,
  itemListByType,
  itemInfo,
  itemInsert,
  itemUpdate,
  itemDelete,
};
