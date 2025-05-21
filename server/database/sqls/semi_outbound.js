// server/database/sqls/semi_outbound.js

/**
 * 1) 외주 대상 생산지시 조회
 *   - inst.out_od = 'Y' 이면서, 아직 처리 중인 J01 상태인 지시만
 */
const selectSemiOutsourceList = `
SELECT
  id.inst_no,                              -- 생산지시 상세 번호
  ih.inst_head,                            -- 지시 헤더 번호
  id.item_code,                            -- 반제품 코드
  id.item_name,                            -- 반제품 명
  id.iord_no       AS order_qty,           -- 지시수량
  DATE_FORMAT(ih.inst_start, '%Y-%m-%d') AS start_date  -- 시작일
FROM inst AS id
JOIN inst_header AS ih
  ON ih.inst_head = id.inst_head
WHERE id.out_od    = 'Y'
  AND ih.inst_stat = 'J01'
ORDER BY ih.inst_start DESC
`;

/**
 * 2) 선택된 생산지시(inst_no) 기준으로 BOM 자재 목록 조회
 *    - 지시수량( iord_no ) × BOM 필요수량 으로 필요수량 계산
 */
const selectSemiOutboundMaterials = `
SELECT
  bc.mater_code,
  m.mater_name,
  bc.unit_code                 AS unit_name,
  ROUND(bc.quantity * id.iord_no, 0) AS required_qty
FROM inst             AS id
JOIN boms             AS bo  ON bo.item_code = id.item_code
JOIN bom_components   AS bc  ON bc.bom_id     = bo.bom_id
JOIN material         AS m   ON m.mater_code  = bc.mater_code
WHERE id.inst_no = ?
ORDER BY bc.mater_code
`;

module.exports = {
  selectSemiOutsourceList,
  selectSemiOutboundMaterials
};
