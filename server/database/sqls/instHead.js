//table=  inst_head (생산지시헤더)
const selectInstHeadList = 
`SELECT   inst_head,
          inst_stat,
          inst_start,
          plans_head,
          inster
FROM inst_header
ORDER BY inst_start DESC`;

const selectInstHeaderById=
 `SELECT    inst_head,
            inst_stat,
            inst_start,
            plans_head,
            inster
FROM inst_header
WHERE inst_head = ?`;

const insertInstHeader= 
`INSERT INTO inst_header (inst_head, inst_start, inst_stat, plans_head, inster)
 VALUES (?, ?, ?, ?, ?)`;

const updateInstHead=
`UPDATE inst_header
SET inst_stat = ?, inster = ?
WHERE inst_head = ?`;

const deleteInstHead=
`DELETE FROM inst_header
WHERE inst_head = ? AND inst_stat = '대기'`;

module.exports = {
  selectInstHeadList,
  selectInstHeaderById,
  insertInstHeader,
  updateInstHead,
  deleteInstHead,
};