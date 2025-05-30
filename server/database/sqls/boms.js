// server/database/sqls/bom_sqls.js

// ── BOM 마스터 ────────────────────────────────
// 1) 전체조회 (+ 옵션검색: bom_id 혹은 item_code)  
const bomList = `
  SELECT b.bom_id
       , b.item_code
       , b.item_name
       , b.registered_date
  FROM boms AS b
  JOIN items AS i
    ON b.item_code = i.item_code
  WHERE i.item_type = 'C01'               -- 완제품만
    AND (? = '' OR b.bom_id    = ?)
    AND (? = '' OR b.item_code = ?)
  ORDER BY b.bom_id
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
SELECT
  CONCAT(
    'BOM',
    DATE_FORMAT(CURDATE(), '%y%m%d'),
    LPAD(
      COALESCE(
        MAX(CAST(SUBSTRING(bom_id, 10, 3) AS UNSIGNED)),  -- BOM250515001 → 10번째부터 3자리
        0
      ) + 1,
      3,
      '0'
    )
  ),
  ?,  -- item_code
  ?,  -- item_name
  NOW()
FROM boms
WHERE bom_id LIKE CONCAT('BOM', DATE_FORMAT(CURDATE(), '%y%m%d'), '%')
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
       , spec
       , unit_code
       , quantity
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
       , spec
       , unit_code
       , quantity
  FROM bom_components
  WHERE item_seq_id = ?
`;

// 3) 등록 (INSERT) – material 테이블에서 정보 가져오기
const bomComponentInsert = `
  INSERT INTO bom_components
    (item_seq_id, bom_id, mater_code, mater_name, spec, unit_code, quantity)
  SELECT
    ?,            -- item_seq_id
    ?,            -- bom_id
    m.mater_code,
    m.mater_name,
    m.spec,
    m.unit_code,
    ?             -- quantity
  FROM material AS m
  WHERE m.mater_code = ?
`;

// 4) 수정 (UPDATE) – material 테이블에서 정보 갱신
const bomComponentUpdate = `
  UPDATE bom_components AS bc
  JOIN material AS m
    ON m.mater_code = ?
  SET bc.mater_code  = m.mater_code
    , bc.mater_name  = m.mater_name
    , bc.spec        = m.spec
    , bc.unit_code   = m.unit_code
    , bc.quantity    = ?
  WHERE bc.item_seq_id = ?
`;

// 5) 삭제 (DELETE)
const bomComponentDelete = `
  DELETE FROM bom_components
   WHERE item_seq_id = ?
`;


// ── 완제품 목록 (BOM 등록 모달용) ─────────────────
//  완제품(item_type='C01')만 조회, 코드 순 정렬
const bomitemsList = `
  SELECT
      item_code
    , item_name
    , unit_code
    , spec
  FROM items
  WHERE item_type = 'C01'
  ORDER BY item_code
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
  bomComponentDelete,

  bomitemsList,
};
