// server/database/sqls/outbound_candidates_inst.js

// 생산지시 기반 LOT 출고 후보 조회
// — 필요수량은 inst.iord_no(지시수량) × BOM 구성 수량
// — LOT 정보는 서브쿼리로만 조회 (없으면 NULL)
const selectOutboundCandidatesByInstHead = `
SELECT
  bc.mater_code,
  m.mater_name,
  bc.unit_code                 AS unit,

  /* 지시수량(iord_no) * BOM 필요수량 */
  (bc.quantity * id.iord_no)   AS required_qty,

  /* 가장 오래된 유효 LOT ID (없으면 NULL) */
  (
    SELECT i2.min_id
    FROM m_inbound i2
    WHERE i2.mater_code = bc.mater_code
      AND (i2.min_stock - i2.min_oqty) > 0
    ORDER BY i2.min_date
    LIMIT 1
  ) AS lot_cnt,

  /* 가장 오래된 유효 LOT 번호 (없으면 NULL) */
  (
    SELECT i2.mater_lot
    FROM m_inbound i2
    WHERE i2.mater_code = bc.mater_code
      AND (i2.min_stock - i2.min_oqty) > 0
    ORDER BY i2.min_date
    LIMIT 1
  ) AS mater_lot

FROM inst_header ih
JOIN inst           id  ON ih.inst_head = id.inst_head
JOIN boms           bo  ON bo.item_code = id.item_code
JOIN bom_components bc  ON bc.bom_id     = bo.bom_id
JOIN material       m   ON m.mater_code  = bc.mater_code

WHERE ih.inst_head = ?
  AND ih.inst_stat = 'J01'

ORDER BY bc.mater_code;
`;

module.exports = { selectOutboundCandidatesByInstHead };
