const express = require('express');
const router = express.Router();
const modalService = require('../services/modal_service.js');

router.get('/modal/search', async(req,res)=>{
  let { type, startDate, endDate } = req.query;
  let list = await modalService.findByDateRange(type, startDate, endDate)
  .catch(err => console.log(err));
  
  
  res.send(list);
});

router.get('/modal/:sorder_code', async (req,res)=>{
  let ordNo = req.params.sorder_code;
  let ordInfo = await modalService.findBySorder(ordNo)
                                  .catch(err => console.log(err));
  res.send(ordInfo);
})


module.exports = router