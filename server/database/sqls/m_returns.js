// server/database/sqls/m_returns.js

// 전체 반품 목록 조회
const selectReturnsList = `
SELECT
  return_id,
  moder_id,
  mater_code,
  DATE_FORMAT(return_date, '%Y-%m-%d') AS return_date,
  manager,
  reason,
  status
FROM m_returns
ORDER BY return_date DESC
`;

// 반품 등록
const insertReturn = `
INSERT INTO m_returns (
  return_id,
  moder_id,
  mater_code,
  return_date,
  manager,
  reason,
  status
) VALUES (?, ?, ?, ?, ?, ?, ?)
`;

module.exports = {
  selectReturnsList,
  insertReturn
};
