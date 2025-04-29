// 자재 발주서 조회 SQL 쿼리 정의
const selectMaterialOrderList = 
`SELECT
   FALSE                             AS 선택
  ,mo.moder_id                       AS 발주번호
  ,m.mater_name                      AS 자재명
  ,COALESCE(inb.total_in, 0)         AS 입고수량
  ,mo.moder_qty                      AS 발주수량
  ,CASE WHEN qc.has_defect = 1 THEN '부적합' ELSE '정상' END AS 품질검사
FROM m_order mo
ORDER BY mo.moder_id`;

module.exports = {
  selectMaterialOrderList
};