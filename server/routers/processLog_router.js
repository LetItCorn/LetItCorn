const express = require('express');
 const router = express.Router();
 const processService = require('../services/processLog_service.js');
 // 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 
  
// 다양한 조건을 기반으로 전체조회 => 다양한 조건은 정해지지 않았으므로 QueryString(질의문자열)으로 유연하게 처리
router.get('/process', async (req, res)=>{
    // GET +  QueryString(질의문자열) => req(Http Request에 대응하는 객체)의 query 속성 사용
    let search = req.query;
    let processList = await processService.findProcess(search)
                         .catch(err => console.log(err));
    res.send(processList);
 });
  
// 단건조회
router.get('/process/:p_log_no', async (req,res)=>{
    let prLogNo = req.params.p_log_no;
    let prLogInfo = await processService.findByProcessLog(prLogNo)
                                    .catch(err => console.log(err));
    res.send(prLogInfo);
 })
 // 등록
router.post('/process', async(req, res)=>{
    let prLogInfo = req.body;
    let result = await processService.addNewPrLog(prLogInfo)
                                    .catch(err => console.log(err));
    res.send(result);
 });
  
// 수정
router.put('/process/:p_log_no', async(req, res)=>{
    let prLogNo = req.params.p_log_no;
    let prLogInfo = req.body;
    let result = await processService.modifyPrLogInfo(prLogNo, prLogInfo)
                                    .catch(err => console.log(err));
    res.send(result);
 });
  
// 삭제
router.delete('/process/:p_log_no', async (req, res)=>{
    let prLogNo = req.params.p_log_no;

    let resInfo = await processService.removePrLogInfo(prLogNo)
 .catch(err => console.log(err));
 res.send(resInfo);
 })
 
 module.exports = router