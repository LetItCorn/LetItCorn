const express = require('express');
const router = express.Router();
const plansService = require('../services/plans_service.js');

//전체조회 (CRUD 예시이므로 따로 추가하셔야 합니다. )
router.get("/plans/list", async (req, res) => {
  try {
    const searchList = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    const result = await plansService.findAllPlans(searchList);
    res.send(result);
  } catch (err) {
    console.error("생산계획 전체조회 실패:", err);
    res.status(500).send({ error: "조회 실패" });
  }
});
//단건조회
router.get('/plans/detail/:plansHead', async (req, res) => {
  try {
    const result = await plansService.findByPlans(req.params.plansHead);
    console.log('📦 디테일 조회 결과:', result);
    res.send(result);
  } catch (err) {
    console.error('상세 조회 실패:', err);
    res.status(500).send({ error: '상세 조회 실패' });
  }
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