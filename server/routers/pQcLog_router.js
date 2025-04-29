const express = require('express');
 const router = express.Router();
 const qulityService = require('../services/pQcLog_service.js');

 router.get('/pqulity', async (req, res)=>{
      let search = req.query;
      let qulityList = await qulityService.findQcLog(search)
                           .catch(err => console.log(err));
      res.send(qulityList);
   });
 router.get('/pqulity/:pqc_no', async (req,res)=>{
       let pqcNo = req.params.pqc_no;
       let pqcInfo = await qulityService.findByQcLog(pqcNo)
                                       .catch(err => console.log(err));
       res.send(pqcInfo);
  })
router.post('/pqulity', async(req, res)=>{
    let pqcInfo = req.body;
    let result = await qulityService.addNewQcLog(pqcInfo)
                                    .catch(err => console.log(err));
    res.send(result);
 });

 router.put('/pqulity/:pqc_no', async(req, res)=>{
     let pqcNo = req.params.pqc_no;
     let pqcInfo = req.body;
     let result = await qulityService.modifyQcLog(pqcNo, pqcInfo)
                                     .catch(err => console.log(err));
     res.send(result);
  });

  router.delete('/pqulity/:pqc_no', async (req, res)=>{
      let pqcNo = req.params.pqc_no;
  
      let resInfo = await qulityService.removeQcLog(pqcNo)
   .catch(err => console.log(err));
   res.send(resInfo);
   })
   
   module.exports = router
