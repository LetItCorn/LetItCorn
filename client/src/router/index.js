import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/LoginView.vue";
import Sorder from "../views/Salesorder.vue";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import RTL from "../views/Rtl.vue";
import Notifications from "../views/Notifications.vue";
import Profile from "../views/Profile.vue";
import SignIn from "../views/SignIn.vue";
import SignUp from "../views/SignUp.vue";
import Leetest from "../views/Leetest.vue";
// import Process from "./views/Process.vue";
import MReturnForm   from '../views/MReturnForm.vue';
import MReturnsList  from '../views/MReturnsList.vue';
import Productionplan from "@/views/Productionplan_v2.vue";
import Item from "@/views/Item.vue";
import Bom from '@/views/Bom.vue';
import Employee from "@/views/Employees.vue";
import ProcessMain from "@/views/ProcessMain.vue";
import Equipment from "@/views/Equipment.vue"; 
import Defect from "@/views/Defect.vue";
import MOrderForm from '@/views/MOrderForm.vue';
import MOrdersList from '@/views/MOrdersList.vue';
import MInboundForm from '@/views/MInboundForm.vue';
import ProductionPlanInquiry from '@/views/ProductionPlanInquiry.vue';
import Bom from '@/views/Bom.vue';
import MOrderForm from '../views/MOrderForm.vue';
import MOrdersList from '../views/MOrdersList.vue';
import MInboundForm from '../views/MInboundForm.vue';
import MOutboundForm from '../views/MOutboundForm.vue';
// import MOutboundList from '../views/MOutboundList.vue';
import MMovement       from '../views/MMovement.vue';
import QCHistory from '../views/QCHistory.vue';

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/salesorder",
    name: "Salesorder",
    component: Sorder,
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
  // {
  //   path: "/process",
  //   name: "Process",
  //   component: Process,
  // },

  {
     // 품목관리 페이지
    path: '/items',
    name: 'Item', 
    component: Item,
  },
  {
    path: "/process",
    name: "Process",
    component: Process,
  },
   {
    // 품목관리 페이지
     path: '/items',
     name: 'Item', 
     component: Item,
   },
  {
    // BOM관리 페이지

    path: '/boms',
    name: 'Bom',
    component: Bom,
  },
    // 설비 관리 
  { path: "/equipments",
    name: "Equipment",
    component: Equipment 
  },
  {
    // 공정관리 페이지
    path: "/processes",
    name: "ProcessMain",
    component: ProcessMain,
  },
  // 불량 코드 관리 페이지
  { path: '/defects',
    name: 'Defect',
    component: Defect
  },
    // 사원관리 페이지
   {
    path: "/employees",
    name: "Employee",
    component: Employee
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
  }
  ,{ 

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
    component: MOutboundForm
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;