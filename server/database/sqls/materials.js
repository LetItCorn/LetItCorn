//자재 재고 조회
const material_List =
`SELECT
  FALSE              AS '선택',          
  m.mater_code       AS '자재코드',
  m.mater_name       AS '자재명',
  m.mater_storage    AS '자재구분',      
  m.safe_stock       AS '안전재고',
  COALESCE(si.total_in,  0)
 -COALESCE(so.total_out, 0) AS '전체재고'
FROM material m
LEFT JOIN (
  SELECT mater_code, SUM(min_qty) AS total_in
    FROM m_inbound
   GROUP BY mater_code
) si ON si.mater_code = m.mater_code
LEFT JOIN (
  SELECT mater_code, SUM(mout_qty) AS total_out
    FROM m_outbound
   GROUP BY mater_code
) so ON so.mater_code = m.mater_code
ORDER BY m.mater_code;`





