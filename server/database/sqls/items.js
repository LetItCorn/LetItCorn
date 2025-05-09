// server/database/sqls/items.js

// 1) 전체 조회 + 조건별 검색 (code, name, type 모두 옵션)
const itemList = `
  SELECT
    A.item_code,
    A.item_name,
    A.item_type,            -- CC 소분류 코드값
    T.code_name   AS type_name,   -- CC 소분류 코드명
    A.unit_code,            -- UU 단위 코드값
    U.code_name   AS unit_name,   -- UU 단위 코드명
    A.spec,
    A.qty
  FROM items A
  LEFT JOIN common_codes T
    ON T.code_group = 'CC' AND T.code_rear = A.item_type
  LEFT JOIN common_codes U
    ON U.code_group = 'UU' AND U.code_rear = A.unit_code
  WHERE 1=1
    AND (? = '' OR A.item_code LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR A.item_name LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR A.item_type = ?)
  ORDER BY A.item_code
`;

// 1-a) 코드별 조회
const itemListByCode = `
  SELECT
    A.item_code,
    A.item_name,
    A.item_type,
    T.code_name   AS type_name,
    A.unit_code,
    U.code_name   AS unit_name,
    A.spec,
    A.qty
  FROM items A
  LEFT JOIN common_codes T
    ON T.code_group = 'CC' AND T.code_rear = A.item_type
  LEFT JOIN common_codes U
    ON U.code_group = 'UU' AND U.code_rear = A.unit_code
  WHERE A.item_code LIKE CONCAT('%', ?, '%')
  ORDER BY A.item_code
`;

// 1-b) 명칭별 조회
const itemListByName = `
  SELECT
    A.item_code,
    A.item_name,
    A.item_type,
    T.code_name   AS type_name,
    A.unit_code,
    U.code_name   AS unit_name,
    A.spec,
    A.qty
  FROM items A
  LEFT JOIN common_codes T
    ON T.code_group = 'CC' AND T.code_rear = A.item_type
  LEFT JOIN common_codes U
    ON U.code_group = 'UU' AND U.code_rear = A.unit_code
  WHERE A.item_name LIKE CONCAT('%', ?, '%')
  ORDER BY A.item_code
`;

// 1-c) 구분(type)별 조회
const itemListByType = `
  SELECT
    A.item_code,
    A.item_name,
    A.item_type,
    T.code_name   AS type_name,
    A.unit_code,
    U.code_name   AS unit_name,
    A.spec,
    A.qty
  FROM items A
  LEFT JOIN common_codes T
    ON T.code_group = 'CC' AND T.code_rear = A.item_type
  LEFT JOIN common_codes U
    ON U.code_group = 'UU' AND U.code_rear = A.unit_code
  WHERE A.item_type = ?
  ORDER BY A.item_code
`;

// 2) 단건 조회 (품목코드 기준)
const itemInfo = `
  SELECT
    A.item_code,
    A.item_name,
    A.item_type,
    T.code_name   AS type_name,
    A.unit_code,
    U.code_name   AS unit_name,
    A.spec,
    A.qty
  FROM items A
  LEFT JOIN common_codes T
    ON T.code_group = 'CC' AND T.code_rear = A.item_type
  LEFT JOIN common_codes U
    ON U.code_group = 'UU' AND U.code_rear = A.unit_code
  WHERE A.item_code = ?
`;

// 3) 등록/수정 MERGE
const itemInsert = `
  INSERT INTO items (item_code, item_name, item_type, unit_code, spec, qty)
  VALUES (?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    item_name = VALUES(item_name),
    item_type = VALUES(item_type),
    unit_code = VALUES(unit_code),
    spec      = VALUES(spec),
    qty       = VALUES(qty)
`;

// 4) 삭제
const itemDelete = `
  DELETE FROM items
  WHERE item_code = ?
`;

// =====================================================================

// 5) 공정 흐름 리스트 (특정 품목)
const itemProcessFlowsList = `
  SELECT
    A.item_code,
    A.item_name,
    A.item_type,
    T.code_name   AS type_name,
    A.unit_code,
    U.code_name   AS unit_name,
    A.spec,
    A.qty,
    C.process_name,
    C.duration_min,
    B.sequence_order,
    B.process_header
  FROM items A
  JOIN item_process_flows B
    ON A.item_code = B.item_code
  JOIN processes C
    ON B.process_header = C.process_header
  LEFT JOIN common_codes T
    ON T.code_group = 'CC' AND T.code_rear = A.item_type
  LEFT JOIN common_codes U
    ON U.code_group = 'UU' AND U.code_rear = A.unit_code
  WHERE A.item_code = ?
  ORDER BY B.sequence_order ASC
`;

// 6) 전체 공정 목록
const processesList = `
  SELECT
    process_code,
    process_header,
    process_name,
    duration_min
  FROM processes
`;

// 7) 공정 흐름 등록/수정 MERGE
const insertProcessItem = `
  INSERT INTO item_process_flows (item_code, process_header, sequence_order, duration)
  VALUES (?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    process_header = VALUES(process_header),
    duration       = VALUES(duration)
`;

// 8) 공정 흐름 삭제
const deleteProcessItem = `
  DELETE FROM item_process_flows
  WHERE process_header = ?
    AND item_code      = ?
    AND sequence_order = ?
`;

module.exports = {
  itemList,
  itemListByCode,
  itemListByName,
  itemListByType,
  itemInfo,
  itemInsert,
  itemDelete,
  itemProcessFlowsList,
  processesList,
  insertProcessItem,
  deleteProcessItem,
};
