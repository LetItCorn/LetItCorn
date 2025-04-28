const express = require('express');
 const router = express.Router();
 const detailService = require('../services/prLogDt_service.js');

 router.get('/details', async (req, res)=>{
      let search = req.query;
      let detailsList = await detailService.findProcess(search)
                           .catch(err => console.log(err));
      res.send(detailsList);
   });
 router.get('/details/:lot_cnt', async (req,res)=>{
       let detailNo = req.params.lot_cnt;
       let detailInfo = await detailService.findByProcessLog(detailNo)
                                       .catch(err => console.log(err));
       res.send(detailInfo);
  })
router.post('/details', async(req, res)=>{
    let detailInfo = req.body;
    let result = await detailService.addNewPrLog(detailInfo)
                                    .catch(err => console.log(err));
    res.send(result);
 });

 router.put('/details/:lot_cnt', async(req, res)=>{
     let detailNo = req.params.no;
     let detailInfo = req.body;
     let result = await detailService.modifyPrLogInfo(detailNo, detailInfo)
                                     .catch(err => console.log(err));
     res.send(result);
  });

  router.delete('/details/:lot_cnt', async (req, res)=>{
      let detailNo = req.params.no;
  
      let resInfo = await detailService.removePrLogInfo(detailNo)
   .catch(err => console.log(err));
   res.send(resInfo);
   })
   
   module.exports = router
