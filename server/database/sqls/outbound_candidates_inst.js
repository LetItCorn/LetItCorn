// server/database/sqls/outbound_candidates_inst.js

/**
 * 선택된 생산지시(inst_header)에 딸린 inst 들의
 * item_code 에 해당하는 모든 BOM 구성 자재를
 * inst의 지시수량(iord_no)만큼 곱해 합산해서 조회
 */
const selectOutboundCandidatesByInstHead = `
SELECT
  bc.mater_code,
  bc.mater_name,
  get_code_name(bc.unit_code)              AS unit_name,
  SUM(bc.quantity * i.iord_no)             AS required_qty,
  bc.spec
FROM inst_header ih
  /* 헤더에 딸린 모든 inst 를 가져와서 */
  JOIN inst           i  ON ih.inst_head = i.inst_head
  /* inst로 제품코드→BOM→구성 자재를 순차 조인 */
  JOIN boms           b  ON b.item_code  = i.item_code
  JOIN bom_components bc ON bc.bom_id     = b.bom_id
WHERE ih.inst_head = ?
  AND ih.inst_stat = 'J01'
GROUP BY
  bc.mater_code,
  bc.mater_name,
  bc.unit_code,
  bc.spec
ORDER BY bc.mater_code;
`;

module.exports = { selectOutboundCandidatesByInstHead };
