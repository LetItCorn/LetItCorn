const express = require('express');
const router = express.Router();
const imodalService = require('../services/inst_modal_service.js');

router.get('/imodal/search', async(req,res)=>{
  let { startDate, endDate } = req.query;
  let list = await imodalService.selectByPlanList(startDate, endDate)
  .catch(err=>console.log(err));
  console.log("검색 날짜:", startDate, endDate);
  res.send(list);
})

module.exports = router