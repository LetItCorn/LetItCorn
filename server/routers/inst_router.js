const express = require('express');
const router = express.Router();
const instService = require('../services/inst_service.js');

//단건조회
router.get('/inst/:inst_head', async (req,res)=>{
  let instNo = req.params.inst_head;
  let instInfo = await instService.findByPlan(instNo)
                                  .catch(err => console.log(err));
  res.send(instInfo);
})
//등록
router.post('/inst/register', async (req, res) => {
  try {
    console.log(req.body);
    let result = await instService.registerInst(req.body);
    console.log(result);
    res.json(result);
  } catch (err) {
    console.error("등록 실패:", err);
    res.status(500).json({ success: false, message: "등록 실패" });
  }
});

//수정
router.put('/inst/:inst_no', async(req, res)=>{
  let instNo = req.params.inst_no;
  let instInfo = req.body;
  let result = await instService.modifyInst(instNo, instInfo)
                                .catch(err => {console.log(err)
    res.status(500).send("수정 실패");
  });
  res.send(result);
});

//삭제
router.delete('/inst/:inst_no', async (req, res)=>{
  let instNo = req.params.inst_no;
  let resInfo = await instService.removePlan(instNo)
                                  .catch(err => console.log(err));
  res.send(resInfo);
});

module.exports = router