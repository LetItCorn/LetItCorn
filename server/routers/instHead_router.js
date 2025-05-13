const express = require('express');
const router = express.Router();
const instHeadService = require('../services/instHead_service.js');

//전체조회 (CRUD 예시이므로 따로 추가하셔야 합니다. )
router.get('/instHead', async (req, res)=>{
  let search = req.query;
  let instHeadList = await instHeadService.findAllInstHead(search)
                         .catch(err => console.log(err));
   res.send(instHeadList); 
});
//단건조회
router.get('/instHead/:inst_no', async (req,res)=>{
  let instHeadNo = req.params.inst_no;
  let instHeadInfo = await instHeadService.findByInstHead(instHeadNo)
                                  .catch(err => console.log(err));
  res.send(instHeadInfo);
})
//수정
router.put('/instHead/:inst_no', async(req, res)=>{
  let instHeadNo = req.params.inst_head;
  let instHeadInfo = req.body;
  let result = await instHeadService.modifyInstHead(instHeadNo, instHeadInfo)
                                .catch(err => console.log(err));
  res.send(result);
});
//삭제
router.delete('/instHead/:inst_head', async (req, res)=>{
  console.log("요청 도착 - 삭제", req.params.inst_head)
  let instHead  = req.params.inst_head;
  let resInfo = await instHeadService.deleteInstCascade(instHead)
                                  .catch(err => console.log(err));
  res.send(resInfo);
});

module.exports = router