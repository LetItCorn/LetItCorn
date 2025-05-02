// server/database/sqls/bom_sqls.js

// ── BOM 마스터 ────────────────────────────────
// 1) 전체조회 (+ 옵션검색: bom_id 혹은 item_code)  
const bomList = `
  SELECT bom_id
       , item_code
       , item_name
       , registered_date
  FROM boms
  WHERE 1=1
    AND (? = '' OR bom_id       = ?)
    AND (? = '' OR item_code    = ?)
  ORDER BY bom_id
`;

// 2) 단건조회 (BOM_ID 기준)
const bomInfo = `
  SELECT bom_id
       , item_code
       , item_name
       , registered_date
  FROM boms
  WHERE bom_id = ?
`;

// 3) 등록 (INSERT)
const bomInsert = `
  INSERT INTO boms (bom_id, item_code, item_name, registered_date)
  VALUES (?, ?, ?, ?)
`;

// 4) 수정 (UPDATE)
const bomUpdate = `
  UPDATE boms
     SET item_code       = ?
       , item_name       = ?
       , registered_date = ?
   WHERE bom_id = ?
`;

// 5) 삭제 (DELETE)
const bomDelete = `
  DELETE FROM boms
   WHERE bom_id = ?
`;

// ── BOM 구성품 ───────────────────────────────
// 1) 목록조회 (특정 BOM_ID 의 구성품 전체)
const bomComponentsList = `
  SELECT item_seq_id
       , bom_id
       , mater_code
       , mater_name
       , mater_type
       , spec
       , unit_code
       , quantity
       , mater_id
  FROM bom_components
  WHERE bom_id = ?
  ORDER BY item_seq_id
`;

// 2) 단건조회 (item_seq_id 기준)
const bomComponentInfo = `
  SELECT item_seq_id
       , bom_id
       , mater_code
       , mater_name
       , mater_type
       , spec
       , unit_code
       , quantity
       , mater_id
  FROM bom_components
  WHERE item_seq_id = ?
`;

// 3) 등록 (INSERT)
const bomComponentInsert = `
  INSERT INTO bom_components
    (item_seq_id, bom_id, mater_code, mater_name, mater_type, spec, unit_code, quantity, mater_id)
  VALUES (?,         ?,      ?,          ?,          ?,           ?,    ?,         ?,        ?)
`;

// 4) 수정 (UPDATE)
const bomComponentUpdate = `
  UPDATE bom_components
     SET mater_code  = ?
       , mater_name  = ?
       , mater_type  = ?
       , spec        = ?
       , unit_code   = ?
       , quantity    = ?
       , mater_id    = ?
   WHERE item_seq_id = ?
`;

// 5) 삭제 (DELETE)
const bomComponentDelete = `
  DELETE FROM bom_components
   WHERE item_seq_id = ?
`;

module.exports = {
  bomList,
  bomInfo,
  bomInsert,
  bomUpdate,
  bomDelete,

  bomComponentsList,
  bomComponentInfo,
  bomComponentInsert,
  bomComponentUpdate,
  bomComponentDelete
};
