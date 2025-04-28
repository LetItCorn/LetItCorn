const express = require('express');
 const router = express.Router();
 const testService = require('../services/testQc_service.js');

 router.get('/test', async (req, res)=>{
      let search = req.query;
      let testList = await testService.findTest(search)
                           .catch(err => console.log(err));
      res.send(testList);
   });

   router.get('/test/:test_no', async (req,res)=>{
    let testNo = req.params.test_no;
    let testInfo = await testService.findByTestQc(testNo)
                                    .catch(err => console.log(err));
    res.send(testInfo);
 })

 router.post('/test', async(req, res)=>{
     let testInfo = req.body;
     let result = await testService.addNewTest(testInfo)
                                     .catch(err => console.log(err));
     res.send(result);
  });

  router.put('/test/:test_no', async(req, res)=>{
      let testNo = req.params.test_no;
      let testInfo = req.body;
      let result = await testService.modifyTestInfo(testNo, testInfo)
                                      .catch(err => console.log(err));
      res.send(result);
   });

router.delete('/test/:test_no', async (req, res)=>{
    let testNo = req.params.test_no;

    let resInfo = await testService.removeTestInfo(testNo)
 .catch(err => console.log(err));
 res.send(resInfo);
 })
 
 module.exports = router