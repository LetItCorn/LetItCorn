// server/database/sqls/outbound_candidates_inst.js

const selectOutboundCandidatesByInstHead = `
SELECT
  bc.mater_code,
  m.mater_name,
  bc.unit_code                 AS unit,

  /* 소수점 없이 정수로 반올림된 필요수량 */
  ROUND(
    CASE
      -- 밀리리터(ml)와 그램(g)은 1,000으로 나눠서 L 또는 kg 단위로 환산
      WHEN bc.unit_code IN ('U04','U02') 
      THEN (bc.quantity * id.iord_no) / 1000
      
      -- 그 외, 리터(L)와 킬로그램(kg)은 그대로
      ELSE (bc.quantity * id.iord_no)
    END
  , 0)                          AS required_qty,

  /* LOT 정보 (가장 오래된 유효 LOT) */
  (
    SELECT i2.min_id
    FROM m_inbound i2
    WHERE i2.mater_code = bc.mater_code
      AND (i2.min_stock - i2.min_oqty) > 0
    ORDER BY i2.min_date
    LIMIT 1
  ) AS lot_cnt,

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
