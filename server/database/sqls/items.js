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

// 3) 등록 (merge문 사용)
const itemInsert = `
  INSERT INTO items (item_code, item_name, item_type, unit_code, spec)
  VALUES (?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    item_name = VALUES(item_name),
    item_type = VALUES(item_type),
    unit_code = VALUES(unit_code),
    spec      = VALUES(spec)
`;

// 4) 삭제 (Delete)
const itemDelete = `
  DELETE FROM items
   WHERE item_code = ?
`;
// ======================================================================

// 1) 공정 흐름 리스트 : 특정품목에 등록된 전체 공정 흐름 목록을 가져오기 위한 SQL
const itemProcessFlowsList = `
  SELECT A.item_code
        , A.item_name
        , A.item_type
        , A.unit_code
        , A.spec
        , C.process_name
        , C.duration_min      
        , B.sequence_order
        , B.process_header        
        FROM items A
        JOIN item_process_flows B
        ON A.item_code = B.item_code  
        JOIN processes C
        ON B.process_header = C.process_header
        WHERE A.item_code = ?
        ORDER BY B.sequence_order ASC
`;

// 2) 공정 흐름 리스트
const processesList = `
  SELECT 
        process_code
        ,process_header
        ,process_name
        ,duration_min
  FROM processes
  where 1=1
`;


// 3) 공정 흐름 등록(merge문 사용)
const insertProcessItem =`
INSERT INTO item_process_flows (item_code, process_header, sequence_order, duration)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE process_header = VALUES(process_header)`;


// 4) 공정 흐름 삭제
const deleteProcessItem = `
delete FROM item_process_flows WHERE process_header = ? AND item_code = ? AND sequence_order = ?
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
