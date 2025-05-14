// server/database/sqls/instructions_open.js

const selectOpenInstructions = `
SELECT
  inst_head,
  DATE_FORMAT(inst_start, '%Y-%m-%d') AS inst_start
FROM inst_header
WHERE inst_stat = '대기'
ORDER BY inst_start DESC
`;

module.exports = { selectOpenInstructions };