// server/database/sqls/materials.js

// 공통코드 조회 정의 (위에 위치)
const unitCode = `
  SELECT code_name, code_values
  FROM common_codes
  WHERE code_group = 'UU'
`;

// 1) 전체 조회 + 조건별 검색 (mater_code, mater_name, unit_code 모두 옵션)
    // 자재 전체 목록 조회
    // - 필터 조건(mater_code, mater_name, unit_code)이 비어 있으면 전체 조회
    // - common_codes UU 그룹을 조인하여 단위 명칭(unit_name)도 함께 가져옴
const materialList = `
  SELECT
    M.mater_code,             -- 자재 코드 (Primary Key)
    M.mater_name,             -- 자재 명칭
    M.safe_stock,             -- 안전 재고량
    M.current_stock,          -- 현재 재고량
    M.m_price,                -- 자재 단가
    M.spec,                   -- 규격
    M.unit_code,              -- 단위 코드 (UU 그룹 참조)
    C.code_name AS unit_name  -- 단위 코드에 대한 명칭
  FROM material M
  LEFT JOIN common_codes C
    ON C.code_group  = 'UU'       -- UU 그룹 = 단위 코드
   AND C.code_values = M.unit_code
  WHERE 1=1
    /* mater_code 필터 (빈 문자열이면 전체) */
    AND (? = '' OR M.mater_code    LIKE CONCAT('%', ?, '%'))
    /* mater_name 필터 (빈 문자열이면 전체) */
    AND (? = '' OR M.mater_name    LIKE CONCAT('%', ?, '%'))
    /* unit_code 필터 (빈 문자열이면 전체) */
    AND (? = '' OR M.unit_code     = ?)
  ORDER BY M.mater_code            -- 자재 코드 오름차순 정렬
`;

// 2) 단건 조회 (mater_code 기준)
// 단건 조회: mater_code에 해당하는 자재 한 건 조회
//     - common_codes UU 그룹을 조인하여 단위 명칭(unit_name)도 함께 가져옴
const materialInfo = `
  SELECT
    M.mater_code,             -- 자재 코드
    M.mater_name,             -- 자재 명칭
    M.safe_stock,             -- 안전 재고량
    M.current_stock,          -- 현재 재고량
    M.m_price,                -- 자재 단가
    M.spec,                   -- 규격
    M.unit_code,              -- 단위 코드
    C.code_name AS unit_name  -- 단위 코드에 대한 명칭
  FROM material M
  LEFT JOIN common_codes C
    ON C.code_group  = 'UU'       -- UU 그룹 = 단위 코드
   AND C.code_values = M.unit_code
  WHERE M.mater_code = ?        -- 조회할 자재 코드
`;

// 3) 등록/수정 MERGE (ON DUPLICATE KEY UPDATE)
    // 자재 등록 또는 수정
    // - INSERT 실패(기존 PK 충돌) 시 UPDATE 수행
const materialInsert = `
  INSERT INTO material (
    mater_code,    -- 자재 코드 (PK)
    mater_name,    -- 자재 명칭
    safe_stock,    -- 안전 재고량
    current_stock, -- 현재 재고량
    m_price,       -- 자재 단가
    spec,          -- 규격
    unit_code      -- 단위 코드
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?
  )
  ON DUPLICATE KEY UPDATE
    mater_name    = VALUES(mater_name),    -- 자재 명칭 갱신
    safe_stock    = VALUES(safe_stock),    -- 안전 재고량 갱신
    current_stock = VALUES(current_stock), -- 현재 재고량 갱신
    m_price       = VALUES(m_price),       -- 자재 단가 갱신
    spec          = VALUES(spec),          -- 규격 갱신
    unit_code     = VALUES(unit_code)      -- 단위 코드 갱신
`;

// 4) 삭제 (mater_code 기준)
    // 자재 삭제: mater_code에 해당하는 자재 삭제
const materialDelete = `
  DELETE FROM material
  WHERE mater_code = ?
`;

// =======================================================================

// 각 자재 관련 SQL 쿼리를 정의
const selectMaterialList = `
SELECT
  FALSE                      AS selected,
  m.mater_code               AS mater_code,
  m.mater_name               AS mater_name,
  m.safe_stock               AS safe_stock,
  m.current_stock            AS total_stock
FROM material m
ORDER BY m.mater_code
`; 

const selectMatLotList = `
SELECT
  i.mater_lot    AS 'LOT 코드',
  i.mater_code   AS '자재 코드',
  m.mater_name   AS '자재명',
  i.min_stock    AS '재고',
  i.min_date     AS '입고일자',
  i.min_edate    AS '유통기한',
  m.safe_stock   AS '안전재고',
  m.current_stock AS '현재재고'
FROM m_inbound AS i
JOIN material  AS m
  ON i.mater_code = m.mater_code
ORDER BY i.min_date
`;

const selectMaterialOne = `
SELECT *
FROM material
WHERE mater_code = ?
`;

const insertMaterial = `
INSERT INTO material (mater_code, mater_name, mater_unit, safe_stock, current_stock)
VALUES (?, ?, ?, ?, ?, 0)
`;

const updateMaterial = `
UPDATE material
SET ?
WHERE mater_code = ?
`;

const deleteMaterial = `
DELETE FROM material
WHERE mater_code = ?
`;

module.exports = {
  unitCode,
  materialList,
  materialInfo,
  materialInsert,
  materialDelete,


  selectMaterialList,
  selectMaterialOne,
  insertMaterial,
  updateMaterial,
  deleteMaterial,
  selectMatLotList
};
