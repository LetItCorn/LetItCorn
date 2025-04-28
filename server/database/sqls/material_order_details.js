// 자재 발주서 상세(라인 아이템) 조회 SQL
const selectMaterialOrderDetail = `
SELECT
   ROW_NUMBER  AS seq,
   m.mater_name                       AS mater_name,
   mo.moder_qty                       AS qty,
   mo.unit_price                      AS unit_price,
   mo.remark                          AS remark,
   CASE WHEN qc.defect_qty > 0 THEN '부적합' ELSE 'PASS' END AS quality_status,
   qc.responsible                     AS responsible
FROM m_order mo
WHERE mo.moder_id = ?
ORDER BY seq
`;
module.exports = { selectMaterialOrderDetail };
