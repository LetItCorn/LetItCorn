// 생산지시 상태 변경 (ex: 대기 → 자재 입고)
const updateInstHeaderStatus = `
UPDATE inst_header
   SET inst_stat = ?
 WHERE inst_head = ?
   AND inst_stat = ?;      -- 안전 장치
`;

module.exports = { updateInstHeaderStatus };