// 생산지시 헤더(대기·진행 …) 목록
const selectInstHeadersByStatus = `
SELECT
  inst_head,
  DATE_FORMAT(plan_start,'%Y-%m-%d') AS plan_start,
  DATE_FORMAT(plan_end  ,'%Y-%m-%d') AS plan_end
FROM inst_header
WHERE inst_stat = ?
ORDER BY plan_start DESC, inst_head DESC
`;

module.exports = { selectInstHeadersByStatus };
