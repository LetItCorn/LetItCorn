const express = require('express');
const router = express.Router();
const planService = require('../services/plan_service.js');

//단건조회
router.get('/plan/:plans_head', async (req,res)=>{
  let planNo = req.params.plans_head;
  let planInfo = await planService.findByPlan(planNo)
                                  .catch(err => console.log(err));
  res.send(planInfo);
})
//등록
router.post('/plan', async(req, res)=>{
  let planInfo = req.body;
  let result = await planService.addNewPlan(planInfo)
                                .catch(err => console.log(err));
  res.send(result);
});
//수정
router.put('/plan/:plan_no', async(req, res)=>{
  let planNo = req.params.plan_no;
  let planInfo = req.body;
  let result = await planService.modifyPlan(planNo, planInfo)
                                .catch(err => console.log(err));
  res.send(result);
});
//삭제
router.delete('/plan/:plan_no', async (req, res)=>{
  let planNo = req.params.plan_no;
  let resInfo = await planService.removePlan(planNo)
                                  .catch(err => console.log(err));
  res.send(resInfo);
});

module.exports = router