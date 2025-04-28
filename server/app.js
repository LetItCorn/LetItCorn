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
const userRouter = require('./routers/user_router.js');

// 기본 라우팅
app.get('/', (req, res)=>{
  res.send('Welcome!!');
})

// 라우터 모듈 등록
app.use('/', productRouter);
app.use('/', userRouter);

// Session 설정 객체
let sessionSetting = session({
  secret : '$#@1235TSecdx', // 암호화 키
  resave : false, // 세션을 언제나 저장할 건지
  saveUninitialized : true, // 세션에 저장할 내역이 없어도 처음부터 세션 생성여부
  // 세션 쿠키 설정
  cookie : {
  httpOnly : true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
  secure : false, // https 환경에서만 적용
  maxAge : 60000 // 유효기간(밀리세컨초 기준)
  }
});
 // Session 설정 등록
app.use(sessionSetting);