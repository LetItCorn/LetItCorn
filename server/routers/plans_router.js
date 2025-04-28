const express = require('express');
const router = express.Router();
const plansService = require('../services/plans_service.js');

//전체조회 (CRUD 예시이므로 따로 추가하셔야 합니다. )
router.get('/plans', async (req, res)=>{
  let plansList = await plansService.findAll()
                         .catch(err => console.log(err));
   res.send(plansList); 
});

//삭제
router.delete('/plans/:plans_head', async (req, res)=>{
  let plansHead = req.params.no;
  let resInfo = await plansService.removePlans(plansHead)
                                  .catch(err => console.log(err));
  res.send(resInfo);
});

module.exports = router