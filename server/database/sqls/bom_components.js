// 조회: 특정 BOM 의 모든 구성품
const selectBomComponents = `
  SELECT item_seq_id      AS component_id
       , bom_id
       , mater_code
       , mater_name
       , mater_type
       , spec
       , unit_code
       , quantity
  FROM bom_components
  WHERE bom_id = ?
  ORDER BY item_seq_id
`;

// 등록
const insertBomComponent = `
  INSERT INTO bom_components
    (bom_id, mater_code, mater_name, mater_type, spec, unit_code, quantity)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

// 수정
const updateBomComponent = `
  UPDATE bom_components
     SET mater_code  = ?
       , mater_name  = ?
       , mater_type  = ?
       , spec        = ?
       , unit_code   = ?
       , quantity    = ?
  WHERE item_seq_id = ?
`;

// 삭제
const deleteBomComponent = `
  DELETE FROM bom_components
  WHERE item_seq_id = ?
`;

module.exports = {
  selectBomComponents,
  insertBomComponent,
  updateBomComponent,
  deleteBomComponent
};
