// 자재 LOT 재고 조회 SQL 쿼리 정의
const selectLotInventory = 
`SELECT
   i.mater_lot                         AS lot_code
  ,i.mater_code                       AS 자재코드
  ,m.mater_name                       AS 자재명
  ,COALESCE(si.total_in,0)
   -COALESCE(so.total_out,0)          AS 재고
  ,i.min_date                         AS 입고일자
  ,i.min_edate                        AS 유통기한
  ,m.safe_stock                       AS 안전재고
FROM m_inbound i
`

module.exports = {
  selectLotInventory
};