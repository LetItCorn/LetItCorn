// qcMgr.js
const getQcList = `
  SELECT test_no
        ,test_feild
        ,test_stand
        ,test_target
        ,process_name
        ,unit
FROM test_qc t LEFT OUTER JOIN processes p
			 ON t.test_target = p.process_code
WHERE 1=1
:searchKeyword
`
module.exports = {
  getQcList
}