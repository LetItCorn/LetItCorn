  require('dotenv').config({path : './database/configs/dbConfig.env'});
  const path = require ('path')
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
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));

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
  const processLogRouter = require('./routers/prLog_router.js');
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
  const instHeaderRouter = require('./routers/inst_header_router.js');
  const clientsRouter = require('./routers/clients_router.js');
  const instructionsRouter = require('./routers/instructions_router.js');
  const semiOutboundRouter = require('./routers/semi_outbound_router.js');
  const semiQcRouter = require('./routers/semi_qc_router.js');
  const semiInboundRouter = require('./routers/semi_inbound_router.js');
  //영업
  const SoRouter = require('./routers/salesorder_router.js'); // 주문서 SalesOrder
  const IsoRouter = require('./routers/Insertsalesorder_router.js'); // 주문서 등록 InsertSalesOrder
  const IsqtRouter = require('./routers/Insertsqt_router.js'); // 출고량 등록 InsertSqt
  const CustomerRouter = require('./routers/customer_router.js'); // 거래처 Customer
  const FinishedProductRouter = require('./routers/finishedproduct_router.js'); // 완제품 FinishedProduct
  const CheckWFpdhistory = require('./routers/checkwfpdhistory_router.js'); // 완제품 입출고 조회 CheckWFpdhistory
  const QInspectionFproductRouter = require('./routers/qinspectionfinishedproduct_router.js'); // 완제품 품질검사 QInspectionFproduct

  //관리
  const userRouter = require('./routers/user_router.js');
  const itemRouter = require('./routers/item_router.js');
  const materialMainRouter = require('./routers/material_main_router.js');
  const bomRouter = require('./routers/bom_router.js');
  const equipmentRouter = require('./routers/equipment_router.js');
  const processDefRouter = require('./routers/process_router.js');
  const defectCodesRouter = require('./routers/defect_codes_router.js');
  const commonCodesRouter = require('./routers/common_codes_router.js');
  const employeeRouter = require('./routers/employee_router.js');

  // 기본 라우팅
 app.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname, "./public", "index.html"));
});
  // 라우터 모듈 등록
  //생산
  app.use('/api', planRouter);
  app.use('/api', plansRouter);
  app.use('/api', instRouter);
  app.use('/api', instsRouter);
  app.use('/api', instModalRouter);
  app.use('/api', modalRouter);
  //공정
  app.use('/api', processRouter);
  app.use('/api', testQCRouter);
  app.use('/api', detailsRouter);
  app.use('/api', qulityRouter);
  app.use('/api', processLogRouter);
  //관리
  app.use('/api', userRouter);
  app.use('/api', itemRouter);
  app.use('/api', materialMainRouter);
  app.use('/api', bomRouter);
  app.use('/api', equipmentRouter);
  app.use('/api', processDefRouter);
  app.use('/api', defectCodesRouter);
  app.use('/api', commonCodesRouter);
  app.use('/api', employeeRouter);   
  //영업
  app.use('/api', SoRouter);
  app.use('/api', IsoRouter);
  app.use('/api', IsqtRouter);
  app.use('/api', CustomerRouter);
  app.use('/api', FinishedProductRouter);
  app.use('/api', CheckWFpdhistory);
  app.use('/api', QInspectionFproductRouter);
  //자재
  app.use('/api', materialsRouter);
  app.use('/api', lotRouter);
  app.use('/api', outboundRouter);
  app.use('/api', materialQCRouter);
  app.use('/api', mOrderRouter);
  app.use('/api', inboundRouter);
  app.use('/api', qcRouter);
  app.use('/api', movementRouter);  
  app.use('/api', qcHistoryRouter);
  app.use('/api', mReturnsRouter);
  app.use('/api', instHeaderRouter );
  app.use('/api', clientsRouter);
  app.use('/api', instructionsRouter);
  app.use('/api', semiOutboundRouter);
  app.use('/api', semiQcRouter);
  app.use('/api', semiInboundRouter);
  
app.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname, "./public", "index.html"));
});
