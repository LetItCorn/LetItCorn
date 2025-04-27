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

// 라우팅 등록 영역 아래는 예시입니다~
const productRouter = require('./routers/product_router.js');

// 기본 라우팅
app.get('/', (req, res)=>{
  res.send('Welcome!!');
})

// 라우터 모듈 등록
app.use('/', productRouter);