// qcMgr_router.js

const express = require('express');
const router = express.Router();
const qcMgrService = require('../services/qcMgr_service.js');

router.get('/getQcMgr', async (req,res) => {
  const data = req.query
  console.log('data', data);                      // 이건 이상하게 보일 수 있음
console.log('keys:', Object.keys(data));        // 키 목록 확인
console.log('test_no:', data.test_no);    
  const result = await qcMgrService.getQcList(data)
                                  .catch(err=>{
                                    console.log(err);
                                  })
  res.send(result);
})

module.exports = router;