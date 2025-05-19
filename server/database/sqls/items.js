// server/database/sqls/items.js

// 공통코드 조회 정의 (위에 위치)
const itemCode = `
  SELECT code_name, code_values
  FROM common_codes
  WHERE code_group = 'CC'
`;
const unitCode = `
  SELECT code_name, code_values
  FROM common_codes
  WHERE code_group = 'UU'
`;

// 1) 전체 조회 + 조건별 검색 (code, name, type 모두 옵션)
const itemList = `
  SELECT
    A.item_code,
    A.item_name,
    A.item_type,
    A.unit_code,
    A.qty,
    (SELECT code_name
       FROM common_codes T0
      WHERE T0.code_values = A.item_type
        AND T0.code_group  = 'CC'
    ) AS type_name,
    (SELECT code_name
       FROM common_codes T0
      WHERE T0.code_values = A.unit_code
        AND T0.code_group  = 'UU'
    ) AS spec
  FROM items A
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

// 3) 등록/수정 MERGE (품목)
const itemInsert = `
  INSERT INTO items (
    item_code,
    item_name,
    item_type,
    unit_code,
    spec,
    qty,
    type_name
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    item_name = VALUES(item_name),
    item_type = VALUES(item_type),
    unit_code = VALUES(unit_code),
    spec      = VALUES(spec),
    qty       = VALUES(qty),
    type_name = VALUES(type_name)
`;

// 4) 품목 삭제
const itemDelete = `
  DELETE FROM items
  WHERE item_code = ?
`;

// 5) 품목 삭제시 공정 흐름 삭제
const flowsDelete = `
  DELETE FROM item_process_flows
  WHERE item_code = ?
`;
// =====================================================================

// 5) 공정 흐름 리스트 (특정 품목)
const itemProcessFlowsList = `
  SELECT
    B.process_header,
    B.process_code,
    B.sequence_order,
    B.item_code,
    C.process_name,
    C.duration_min
  FROM item_process_flows B
  JOIN processes C
    ON B.process_code = C.process_code
  WHERE B.item_code = ?
  ORDER BY B.sequence_order
`;

// 6) 전체 공정 목록 (셀렉트 옵션)
const processesList = `
  SELECT
    process_code,
    process_name,
    duration_min
  FROM processes
`;

// 7-a) 신규 process_header 생성용
const getNextProcessHeader = `
  SELECT
    CONCAT(
      'PH',
      LPAD(
        IFNULL(MAX(CAST(SUBSTRING(process_header, 3) AS UNSIGNED)), 0) + 1,
        3,
        '0'
      )
    ) AS next_ph
  FROM item_process_flows
`;

// 7-b) 공정 흐름 등록/수정 MERGE (단일 행)
const insertProcessItem = `
  INSERT INTO item_process_flows (
    process_header,
    process_code,
    sequence_order,
    item_code
  ) VALUES (?, ?, ?, ?)
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
  itemListByCode,
  itemListByName,
  itemListByType,
  itemInfo,
  itemCode,           // 공통코드(CC) 조회
  unitCode,           // 공통코드(UU) 조회
  itemInsert,
  itemDelete,
  itemProcessFlowsList,
  processesList,
  getNextProcessHeader,
  insertProcessItem,
  deleteProcessItem,
  flowsDelete
};


