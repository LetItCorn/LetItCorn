require('dotenv').config({path : './database/configs/dbConfig.env'});
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended : false }));
app.use(express.json()); 


// Server 실행 
app.listen(3000, ()=>{
  console.log('Server Start');
  console.log('http://localhost:3000');
})

// 라우팅 등록 영역 예시
const plansRouter = require('./routers/plans_router.js');

//쪼의 영역
const processRouter = require('./routers/processLog_router.js');
const testQCRouter = require('./routers/testQc_router.js');
const detailsRouter = require('./routers/prLogDt_router.js');
const qulityRouter = require('./routers/pQcLog_router.js');
// 기본 라우팅
app.get('/', (req, res)=>{
  res.send('Welcome!!');
})

// 라우터 모듈 등록 확인
app.use('/', plansRouter);

//쪼의 영역
app.use('/', processRouter);
app.use('/', testQCRouter);
app.use('/', detailsRouter);
app.use('/', qulityRouter);