const express = require('express');
 const router = express.Router();
 const processService = require('../services/processLog_service.js');
 // 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 
  
 //자재입고 상태의 생산지시 정보 호출
 router.get('/proce', async(req,res)=>{
    console.log("route");
    let result = await processService.getinst()
                                    .catch(err=>{
                                        console.log(err);
                                    })
                                    res.send(result)
 })

 // 선택한 생산지시의 품목에 알맞은 공정흐름도 호출
 router.get('/getFlow/:data', async(req,res)=>{
    let data = req.params.data
    console.log(data);
    let result = await processService.getFlow(data)
                 .catch(err=>{
                    console.log(err);
                 })
    res.send(result)
 })

 router.post('/regPrLog', async (req,res)=>{
   let data = req.body
   let result = await processService.regProLog(data)
                     .catch(err=>{
                        console.log(err);
                     })
   console.log(data);
   res.send(result)
 })

 // 공정에 알맞은 품질검사를 호출
 router.get('/getQcTest/:data', async (req,res)=>{
   let data = req.params.data
   let result = await processService.getQcTest(data)
                                    .catch(err=>{
                                       console.log(err);
                                    })
   console.log(result);
   res.send(result)
 })

 // 품질검사 결과 저장
 router.post('/regQcLog',async (req,res)=>{
   let data = req.body
   let result = await processService.regQcLog(data)
                                    .catch(err=>{
                                       console.log(err);
                                    })
   res.send(result)
 })

 //최종 생산지시 헤더 완료
 router.put('/processes', async (req,res)=>{
   let data = req.body
   let result = await processService.updateInHead(data)
                                    .catch(err=>{
                                       console.log(err);
                                    })
   res.send(result)
 })


 module.exports = router