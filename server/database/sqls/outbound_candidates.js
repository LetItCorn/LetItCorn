const selectOutboundCandidates = `
SELECT
  FALSE                            AS 선택,
  inst.lot_cnt                     AS 생산LOT번호,
  pr.item_name                     AS 제품명,
  m.mater_name                     AS 자재명,
  ih.inster                        AS 담당자,
  inst.iord_no                     AS 출고수량,
  COALESCE(st.total_stock, 0)      AS 전체재고
FROM inst
ORDER BY inst.lot_cnt;
`;

module.exports = { selectOutboundCandidates };