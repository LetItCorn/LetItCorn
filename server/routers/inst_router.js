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
router.post('/register', async (req, res) => {
  try {
    let result = await instService.registerInst(req.body);
    res.json(result);
  } catch (err) {
    console.error("등록 실패:", err);
    res.status(500).json({ success: false, message: "등록 실패" });
  }
});
//번호 생-성 후 입력
router.post("/generate-numbers", async (req, res) => {
  const conn = await mariadb.getConnection();
  try {
    const { count } = req.body;
    const inst_nos = [];
    const lot_nos = [];

    for (let i = 0; i < count; i++) {
      const instNo = await getNextInstNo(conn);
      const lotNo = await getNextLotNo(conn);
      inst_nos.push(instNo);
      lot_nos.push(lotNo);
    }

    res.json({ inst_nos, lot_nos });
  } catch (err) {
    console.error("번호 생성 오류:", err);
    res.status(500).send("번호 생성 실패");
  } finally {
    conn.release();
  }
});

//수정
router.put('/inst/:inst_no', async(req, res)=>{
  let instNo = req.params.inst_no;
  let instInfo = req.body;
  let result = await instService.modifyPlan(instNo, instInfo)
                                .catch(err => console.log(err));
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