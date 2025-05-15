// server/database/sqls/inst_headers.js
const selectInstHeaderByStatus = `
SELECT
  inst_head,
  DATE_FORMAT(inst_start, '%Y-%m-%d') AS inst_start,
  inst_stat,
  plans_head,
  inster
FROM inst_header
WHERE inst_stat = ?
ORDER BY inst_start DESC
`;

module.exports = { selectInstHeaderByStatus };
