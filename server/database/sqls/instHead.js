//table=  inst_head (생산지시헤더)
const selectInstHeadList = 
`SELECT   inst_head
          ,inst_start
          ,inst_stat
          ,plans_head
          ,inster
FROM inst_head
ORDER BY inst_head`;

const updateInstHead=
`UPDATE inst_head
SET ?
WHERE inst_head = ?`;

const deleteInstHead=
`DELETE FROM inst_head
WHERE inst_head = ?`;

module.exports = {
  selectInstHeadList,
  updateInstHead,
  deleteInstHead,
};