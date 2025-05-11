// server/database/sqls/items.js
// 1) 전체 조회 + 조건별 검색 (code, name, type 모두 옵션)
const itemList = `
  SELECT
    A.item_code,
    A.item_name,
    A.item_type,            
    A.unit_code,            
    A.qty,
    (SELECT code_name FROM common_codes T0 WHERE T0.code_values = A.item_type AND T0.code_group ='CC') AS type_name,
    (SELECT code_name FROM common_codes T0 WHERE T0.code_values = A.unit_code AND T0.code_group ='UU') AS spec
  FROM items A
  WHERE 1=1
    AND (? = '' OR A.item_code LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR A.item_name LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR A.item_type = ?)
  ORDER BY A.item_code
`;

// 품목구분 가져오기
const itemCode = `
SELECT code_name, code_values
FROM common_codes
WHERE code_group = 'CC'
`;

// 단위코드 가져오기
const unitCode =`
SELECT code_name, code_values
FROM common_codes
WHERE code_group = 'UU'
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
    B.sequence_order
  FROM items A
  JOIN item_process_flows B
    ON A.item_code = B.item_code
  JOIN processes C
    ON B.process_code = C.process_code
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
    process_name,
    duration_min
  FROM processes
`;

// 7) 공정 흐름 등록/수정 MERGE
const insertProcessItem = `
  INSERT INTO item_process_flows (
  process_header,
  process_code,
  sequence_order,
  item_code
)
SELECT
  CONCAT('PH', LPAD(IFNULL(MAX(CAST(SUBSTRING(process_header, 3) AS UNSIGNED)), 0) + 1, 3, '0')),
  ?, ?, ?
FROM item_process_flows
ON DUPLICATE KEY UPDATE
  sequence_order = VALUES(sequence_order),
  item_code      = VALUES(item_code)
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
  itemCode,
  unitCode,
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
