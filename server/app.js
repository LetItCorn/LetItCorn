  require('dotenv').config({path : './database/configs/dbConfig.env'});
  const express = require('express');
  const app = express();
  const session = require('express-session');

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

  // 라우팅 등록 영역
  //생산
  const planRouter = require('./routers/plan_router.js');
  const plansRouter = require('./routers/plans_router.js');
  const instRouter = require('./routers/inst_router.js');
  const instsRouter = require('./routers/instHead_router.js');
  const instModalRouter = require('./routers/inst_modal_router.js');
  const modalRouter = require('./routers/modal_router');
  //쪼의 영역(공정)
  const processRouter = require('./routers/processLog_router.js');
  const testQCRouter = require('./routers/testQc_router.js');
  const detailsRouter = require('./routers/prLogDt_router.js');
  const qulityRouter = require('./routers/pQcLog_router.js');
  //자재
  const materialsRouter = require('./routers/materials_router.js');
  const materialQCRouter = require('./routers/material_qc_router.js');
  const lotRouter = require('./routers/lot_router.js');
  const outboundRouter = require('./routers/outbound_router.js');
  const mOrderRouter = require('./routers/m_order_router');
  const inboundRouter = require('./routers/inbound_router.js');
  const qcRouter      = require('./routers/qc_router.js');
  const movementRouter = require('./routers/movement_router.js');
  const qcHistoryRouter = require('./routers/qc_history_router.js');
  const mReturnsRouter = require('./routers/m_returns_router.js');
  const instHeaderAPIRouter= require('./routers/inst_header_router.js');
  const clientsRouter = require('./routers/clients_router.js');
  //영업
  const SoRouter = require('./routers/salesorder_router.js'); // 주문서 SalesOrder
  const IsoRouter = require('./routers/Insertsalesorder_router.js'); // 주문서 등록 InsertSalesOrder
  // const ClientRouter = require('./routers/client_router.js'); // 거래처 조회 Client
  //관리
  const userRouter = require('./routers/user_router.js');
  const itemRouter = require('./routers/item_router.js');
  const bomRouter = require('./routers/bom_router.js');
  const equipmentRouter = require('./routers/equipment_router.js');
  const processDefRouter = require('./routers/process_router.js');
  const defectCodesRouter = require('./routers/defect_codes_router.js');
  const commonCodesRouter = require('./routers/common_codes_router.js');
  const employeeRouter = require('./routers/employee_router.js');

  // 기본 라우팅
  app.get('/', (req, res)=>{
    res.send('Welcome!!');
  })
  // 라우터 모듈 등록
  //생산
  app.use('/', planRouter);
  app.use('/', plansRouter);
  app.use('/', instRouter);
  app.use('/', instsRouter);
  app.use('/', instModalRouter);
  app.use('/', modalRouter);
  //공정
  app.use('/', processRouter);
  app.use('/', testQCRouter);
  app.use('/', detailsRouter);
  app.use('/', qulityRouter);
  //관리
  app.use('/', userRouter);
  app.use('/', itemRouter);
  app.use('/', bomRouter);
  app.use('/', equipmentRouter);
  app.use('/', processDefRouter);
  app.use('/', defectCodesRouter);
  app.use('/', commonCodesRouter);
  app.use('/', employeeRouter);   
  //영업
  app.use('/', SoRouter);
  app.use('/', IsoRouter);
  // app.use('/', ClientRouter);
  //자재
  app.use('/', materialsRouter);
  app.use('/', lotRouter);
  app.use('/', outboundRouter);
  app.use('/', materialQCRouter);
  app.use('/', mOrderRouter);
  app.use('/', inboundRouter);
  app.use('/', qcRouter);
  app.use('/', movementRouter);  
  app.use('/', qcHistoryRouter);
  app.use('/', mReturnsRouter);
  app.use('/', instHeaderAPIRouter);
  app.use('/', clientsRouter);
