// 전체 입고 이력 조회를 위한 sql 쿼리 문자열
// m_inbound 테이블에서 주요 컬럼을 선택하고, 날짜 포맷을 'YYYY-mm-DD'로 변환
// 최신 입고 순으로 정렬 (내림차순)
const selectInboundList = `
SELECT
  min_id            AS min_id,
  mater_code        AS mater_code,
  min_qty           AS min_qty,
  DATE_FORMAT(min_date, '%Y-%m-%d') AS min_date,
  min_checker       AS min_checker,
  mater_lot         AS mater_lot,
  DATE_FORMAT(min_edate, '%Y-%m-%d') AS min_edate,
  min_stock         AS min_stock,
  min_oqty          AS min_oqty,
  test_no           AS test_no
FROM m_inbound
ORDER BY min_date DESC
`;

// 입고 등록을 위한 insert sql 쿼리 문자열
// m_inbound 테이블에 필요한 모들 컬럼을 순서대로 삽입
const insertInbound = `
INSERT INTO m_inbound (
  min_id, mater_code, min_qty, min_date, min_checker,
  mater_lot, min_edate, min_stock, min_oqty, test_no
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

// 자재 현재고 누적 갱신용 sql
const updateMaterialStock = `
update material
set current_stock = current_stock + ?
where mater_code = ?
`;


module.exports = {
  selectInboundList,
  insertInbound,
  updateMaterialStock
};