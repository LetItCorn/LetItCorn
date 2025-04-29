const express = require('express');
 const router = express.Router();
 const detailService = require('../services/prLogDt_service.js');

 router.get('/details', async (req, res)=>{
      let search = req.query;
      let detailsList = await detailService.findDetails(search)
                           .catch(err => console.log(err));
      res.send(detailsList);
   });
 router.get('/details/:lot_cnt', async (req,res)=>{
       let detailNo = req.params.lot_cnt;
       let detailInfo = await detailService.findByDetails(detailNo)
                                       .catch(err => console.log(err));
       res.send(detailInfo);
  })
router.post('/details', async(req, res)=>{
    let detailInfo = req.body;
    let result = await detailService.addNewDetails(detailInfo)
                                    .catch(err => console.log(err));
    res.send(result);
 });

 router.put('/details/:lot_cnt', async(req, res)=>{
     let detailNo = req.params.lot_cnt;
     let detailInfo = req.body;
     let result = await detailService.modifyDetails(detailNo, detailInfo)
                                     .catch(err => console.log(err));
     res.send(result);
  });

  router.delete('/details/:lot_cnt', async (req, res)=>{
      let detailNo = req.params.lot_cnt;
  
      let resInfo = await detailService.removeDetails(detailNo)
   .catch(err => console.log(err));
   res.send(resInfo);
   })
   
   module.exports = router
