//table = test_qc
// join은 self입니다 쪼
const selectTest = 
`SELECT   test_no
          ,test_feild
          ,test_res
          ,test_stat
          ,test_etc
          ,test_stand
FROM test_qc
ORDER BY test_no`;

const selectTestOne = 
`SELECT   test_no
          ,test_feild
          ,test_res
          ,test_stat
          ,test_etc
          ,test_stand
FROM test_qc
WHERE test_no = ?`;

const testInsert = 
`INSERT INTO test_qc (test_no, test_feild, test_res, test_stat, test_etc, test_stand)
VALUES (?, ?, ?, ?, ?, ?)`;

const testUpdate = 
`UPDATE test_qc
SET ?
WHERE test_no = ?`;

const testDelete =
`DELETE FROM test_qc
WHERE test_no = ?`;

module.exports={
  selectTest,
  selectTestOne,
  testInsert,
  testUpdate,
  testDelete,
}