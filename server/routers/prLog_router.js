const express = require('express');
 const router = express.Router();
 const prLogService = require('../services/prLog_service.js');



router.get('/getPrlog', async (req, res)=>{

      let result = await prLogService.getPrLog()
                            .catch(err => console.log(err));
      res.send(result);
   })
router.get('/getPrlogDt/:data', async (req, res)=>{
      let data = req.params.data;
      let result = await prLogService.getPrLogDt(data)
                            .catch(err => console.log(err));
      res.send(result);
   })

module.exports = router;