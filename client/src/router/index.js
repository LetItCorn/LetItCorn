import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue"; // 기본 대시보드

import Login from "../views/LoginView.vue";
import Sorder from "../views/Salesorder.vue";
import InsertSorder from "../views/Insertsalesorder.vue";
import Customer from "../views/Customer.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import RTL from "../views/Rtl.vue";
import Notifications from "../views/Notifications.vue";
import Profile from "../views/Profile.vue";
import SignIn from "../views/SignIn.vue";
import SignUp from "../views/SignUp.vue";
import Leetest from "../views/Leetest.vue";
import MReturnForm   from '../views/MReturnForm.vue';
import MReturnsList  from '../views/MReturnsList.vue';
import Productionplan from "@/views/Productionplan_v2.vue";
import Item from "@/views/Item.vue";
import Employee from "@/views/Employees.vue";
import ProcessMain from "@/views/ProcessMain.vue";
import Equipment from "@/views/Equipment.vue"; 
import Defect from "@/views/Defect.vue";
import CommonCode from "@/views/CommonCode.vue";
import MInboundForm from '@/views/MInboundForm.vue';
import ProductionPlanInquiry from '@/views/ProductionPlanInquiry.vue';
import MOrderForm from '../views/MOrderForm.vue';
import MOrdersList from '../views/MOrdersList.vue';
import Bom from '@/views/Bom.vue';
import MMovement       from '../views/MMovement.vue';
import QCHistory from '../views/QCHistory.vue';
import MOutboundForm from '../views/MOutboundForm.vue';
import ProductionInst from "@/views/ProductionInst.vue";
import Process from "@/views/process.vue";
import SFproduct from "../views/SFproduct.vue";
import Material from "@/views/Material.vue";
import ProductionInstInquiry from "@/views/ProductionInstInquiry.vue";
import InsertSqt from "../views/Insertsqt.vue";
import FinishedProduct from "@/views/FinishedProduct.vue";
import CheckWFpdHistory from "@/views/CheckWFpdHistory.vue"; // 완제품 입출고 이력 조회 check waringhouse finished product history
import QInspectionFproduct from "@/views/QInspectionFinishedProduct.vue"; // 완제품 품질검사
import ProcessLog from "@/views/ProcessLog.vue";
import QcLog from "@/views/QcLog.vue";
import Machin from "@/views/Machin.vue";
import Fault from "@/views/Fault.vue";
import SemiOutbound from "@/views/SemiOutbound.vue";
import SemiInbound from '@/views/SemiInbound.vue';
import QcMng from "@/views/QcMng.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/login",
  },
  {
    // 로그인 페이지
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    // 대시보드 페이지
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    // 주문서 페이지
    path: "/salesorder",
    name: "Salesorder",
    component: Sorder,
  },
  {
    // 주문서 등록 페이지
    path: "/insertsalesorder",
    name: "Insertsalesorder",
    component: InsertSorder,
  },
  {
    // 거래처 페이지
    path: "/customer",
    name: "Customer",
    component: Customer,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: Notifications,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: SignUp,
  }, 
  {
    path: "/leetest",
    name: "Leetest",
    component: Leetest,
  },
  {
    // 품목관리 페이지
    path: '/items',
    name: 'Item', 
    component: Item,
  },
  {
    // 자재관리 페이지
    path: '/materials',
    name: 'Material', 
    component: Material,
  },
  {
    // BOM관리 페이지
    path: '/boms',
    name: 'Bom',
    component: Bom,
  },
  {  
    // 설비관리 페이지
  path: "/equipments",
    name: "Equipment",
    component: Equipment 
  },
  {
    // 공정관리 페이지
    path: "/processes",
    name: "ProcessMain",
    component: ProcessMain,
  },
  {
    // 불량코드관리 페이지
    path: '/defects',
    name: 'Defect',
    component: Defect
  },
  { 
    // 사원관리 페이지
    path: "/employees",
    name: "Employee",
    component: Employee
  },
  { 
    // 공통코드관리 페이지
    path: "/common_codes",
    name: "CommonCode",
    component: CommonCode
  },
  {
    path: '/plan',
    name: 'ProductionPlan',
    component: Productionplan,
  },
  {
    path: '/plans',
    name: 'ProductionPlanInquiry',
    component: ProductionPlanInquiry,
  },
  {
    path: '/inst',
    name: 'ProductionInst',
    component: ProductionInst,
  },
  {
    path: '/insts',
    name: 'ProductionInstInquiry',
    component: ProductionInstInquiry,
  },
  { 
    path: '/m_orders',
    name: 'MOrderForm',
    component: MOrderForm, 
  },
  {
    path: '/m_orderslist',
    name: 'MOrdersList',
    component: MOrdersList,
  },
  {
    path: '/m_inbound',
    name: 'MInboundForm',
    component: MInboundForm,
  },
  {
    path: '/returns',
    name: 'MReturnForm',
    component: MReturnForm,
  },
  {
    path: '/returns/list',
    name: 'MReturnsList',
    component: MReturnsList,
  },
  {
    path: '/m_outbound',
    name: 'MOutboundForm',
    component: MOutboundForm,
  },
  // {
  //   path: '/m_outbound_list',
  //   name: 'MOutboundList',
  //   component: MOutboundList
  // },
  {
    path: '/m_movement',
    name: 'MMovement',
    component: MMovement
  },
  {
    path: '/qc_history',
    name: 'QCHistory',
    component: QCHistory
  },
  {
    path: '/process',
    name:'process',
    component: Process
  },
  {
    path: '/sf_product',
    name:'sfproduct',
    component: SFproduct 
  },
  {
    // 출고량 등록 페이지
    path: '/insertsqt',
    name: 'InsertSqt',
    component: InsertSqt
  },
  {
    // 완제품 페이지
    path: '/finishedproduct',
    name: 'FinishedProduct',
    component: FinishedProduct
  },
  {
    // 완제품 입출고이력 조회 check waringhouse finished product history 
    path: '/checkwfpdhistory',
    name: 'CheckWFpdHistory',
    component: CheckWFpdHistory
  },
  {
    // 완제품 품질검사
    path: '/qinspectionfinishedproduct',
    name: 'QInspectionFinishedproduct',
    component: QInspectionFproduct
  },{
    // 공정결과
    path: '/ProcessLogView',
    name: 'ProcessLogView',
    component: ProcessLog
  },
  {
    // 품질검사 조회
    path: '/QcLog',
    name: 'QcLog',
    component: QcLog
  },
  {
    // 불량 조회
    path: '/Fault',
    name: 'Fault',
    component: Fault
  },
  {
    //  공정 관리
    path: '/Machin',
    name: 'Machin',
    component: Machin
  },
  // 반제품 자재 출고 페이지
  {
    path: '/semi-outbound',
    name: 'SemiOutbound',
    component: SemiOutbound
  },
  {
    path: '/semi-inbound',
    name: 'SemiInbound',
    component: SemiInbound
  },{
    path: '/QcMng',
    name: 'QcMng',
    component: QcMng
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;