// 단일 구성품 상세 조회
const selectBomComponentById = `
  SELECT item_seq_id      AS component_id
       , bom_id
       , mater_code
       , mater_name
       , mater_type
       , spec
       , unit_code
       , quantity
  FROM bom_components
  WHERE item_seq_id = ?
`;

module.exports = {
  selectBomComponentById
};
