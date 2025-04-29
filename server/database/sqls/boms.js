// server/database/sqls/boms.js

// 1) 전체 BOM 조회
const selectBomAll = `
SELECT bom_id, item_name, registered_date, item_code
FROM boms
ORDER BY bom_id
`;

// 2) 완제품 코드(item_code)로 필터된 BOM 조회
const selectBomByItemCode = `
SELECT bom_id, item_name, registered_date, item_code
FROM boms
WHERE item_code = ?
ORDER BY bom_id
`;

// 3) 단건 조회 (bom_id 기준)
const selectBomById = `
SELECT bom_id, item_name, registered_date, item_code
FROM boms
WHERE bom_id = ?
`;

// 4) 등록
const insertBom = `
INSERT INTO boms (bom_id, item_name, registered_date, item_code)
VALUES (?, ?, NOW(), ?)
`;

// 5) 수정
const updateBom = `
UPDATE boms
SET item_name = ?, item_code = ?
WHERE bom_id = ?
`;

// 6) 삭제
const deleteBom = `
DELETE FROM boms
WHERE bom_id = ?
`;

module.exports = {
  selectBomAll,
  selectBomByItemCode,
  selectBomById,
  insertBom,
  updateBom,
  deleteBom,
};
