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

const insertInbound = `
INSERT INTO m_inbound (
  min_id, mater_code, min_qty, min_date, min_checker,
  mater_lot, min_edate, min_stock, min_oqty, test_no
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

module.exports = {
  selectInboundList,
  insertInbound
};