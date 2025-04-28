const express = require('express');
const router = express.Router();
const plansService = require('../services/plans_service.js');

//전체조회 (CRUD 예시이므로 따로 추가하셔야 합니다. )
router.get('/plans', async (req, res)=>{
  let search = req.query;
  let plansList = await plansService.findAllPlans(search)
                         .catch(err => console.log(err));
   res.send(plansList); 
});
//단건조회
router.get('/plans/:plans_head', async (req,res)=>{
  let plansNo = req.params.plans_head;
  let plansInfo = await plansService.findByPlans(plansNo)
                                  .catch(err => console.log(err));
  res.send(plansInfo);
})
//등록
router.post('/plans', async(req, res)=>{
  let plansInfo = req.body;
  let result = await plansService.addNewPlans(plansInfo)
                                .catch(err => console.log(err));
  res.send(result);
});
//수정
router.put('/plans/:plans_head', async(req, res)=>{
  let plansNo = req.params.plans_head;
  let plansInfo = req.body;
  let result = await plansService.modifyPlans(plansNo, plansInfo)
                                .catch(err => console.log(err));
  res.send(result);
});
//삭제
router.delete('/plans/:plans_head', async (req, res)=>{
  let plansHead = req.params.plans_head;
  let resInfo = await plansService.removePlans(plansHead)
                                  .catch(err => console.log(err));
  res.send(resInfo);
});

module.exports = router