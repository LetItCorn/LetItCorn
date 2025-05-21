// server/database/sqls/outbound_candidates_inst.js
/**
 * 선택된 생산지시(inst_header)에 딸린 inst 들의
 * item_code 에 해당하는 모든 BOM 구성 자재를
 * inst 의 지시수량(iord_no)만큼 곱해 합산해서 조회
 * ▸ 단위 환산(ml→L, g→kg 등) 하지 않음
 */
const selectOutboundCandidatesByInstHead = `
SELECT
  bc.mater_code,
  bc.mater_name,
  get_code_name(bc.unit_code)      AS unit_name,   -- 단위명
  SUM(bc.quantity * i.iord_no)     AS required_qty,
  bc.spec
FROM inst_header ih
JOIN inst            i  ON ih.inst_head = i.inst_head      -- 헤더 밑 inst
JOIN boms            b  ON b.item_code  = i.item_code      -- inst → BOM
JOIN bom_components  bc ON bc.bom_id     = b.bom_id        -- BOM → 자재
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
