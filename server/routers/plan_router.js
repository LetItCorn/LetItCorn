const express = require('express');
const router = express.Router();
const planService = require('../services/plan_service.js');

// 단건조회
router.get('/plan/:plans_head', async (req, res) => {
  let planNo = req.params.plans_head;
  const result = await planService.findByPlan(planNo).catch(console.error);
  res.send(result);
});

// 등록
router.post("/plan", async (req, res) => {
  console.log('받은 req.body:', req.body);
  try {
    const result = await planService.addNewPlan(req.body, req.session.user);
    res.send(result);
  } catch (err) {
    console.error("등록 실패:", err);
    res.status(500).send({ error: "등록 실패" });
  }
});
//수정
router.put("/plan/:plans_head", async(req,res)=>{
  let plans_head = req.params.plans_head;
  let { header, details } = req.body;

  let result = await planService.modifyPlan(header, details, plans_head);
  res.json(result)
});

module.exports = router;