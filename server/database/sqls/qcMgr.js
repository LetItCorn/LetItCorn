// qcMgr.js
// 검색조건 넣어서 정보 불러오기
const getQcList = `
  SELECT test_no
        ,test_feild
        ,test_stand
        ,test_target
        ,process_name
        ,unit_name
FROM test_qc t LEFT OUTER JOIN processes p
			 ON t.test_target = p.process_code
WHERE 1=1
:searchKeyword
`
// select option용 공정정보 불러오기
const getOptions = `
SELECT process_code
      ,process_name
FROM processes
`
//merge
const setQc = `
INSERT INTO test_qc (
  test_no,
  test_feild,
  test_stand,
  test_target,
  unit_name
) VALUES (?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
  test_feild = VALUES(test_feild),
  test_stand = VALUES(test_stand),
  test_target = VALUES(test_target),
  unit_name = VALUES(unit_name)`

const delQc = `
DELETE FROM test_qc
WHERE test_no = ?
`

module.exports = {
  getQcList,
  getOptions,
  setQc,
  delQc,
}