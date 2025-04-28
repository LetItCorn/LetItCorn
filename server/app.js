require('dotenv').config({path : './database/configs/dbConfig.env'});
const express = require('express');
const app = express();

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
const itemRouter = require('./routers/item_router.js');
const userRouter = require('./routers/user_router.js');

//이용진
const materialsRouter = require('./routers/materials_router.js');
const lotRouter       = require('./routers/lot_router.js');
const poRouter        = require('./routers/purchaseorder_router.js');
const ioRouter        = require('./routers/inbound_outbound_router.js');
const moRouter    = require('./routers/material_order_router.js');
const outboundRouter = require('./routers/outbound_router.js');
const materialQCRouter = require('./routers/material_qc_router.js');

// 기본 라우팅
app.get('/', (req, res)=>{
  res.send('Welcome!! / lisa branch test ');
})

// 라우터 모듈 등록 확인
app.use('/', plansRouter);

//쪼의 영역
app.use('/', processRouter);
app.use('/', testQCRouter);
app.use('/', detailsRouter);
app.use('/', qulityRouter);
app.use('/', itemRouter);

//이용진
app.use('/', materialsRouter);
app.use('/', lotRouter);
app.use('/', poRouter);
app.use('/', ioRouter);
app.use('/', moRouter);
app.use('/', outboundRouter);
app.use('/', materialQCRouter);


// 라우터 모듈 등록
app.use('/', productRouter);
app.use('/', userRouter);

