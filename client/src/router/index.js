import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/LoginView.vue";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import RTL from "../views/Rtl.vue";
import Notifications from "../views/Notifications.vue";
import Profile from "../views/Profile.vue";
import SignIn from "../views/SignIn.vue";
import SignUp from "../views/SignUp.vue";
import Leetest from "../views/Leetest.vue";
import ItemList  from '@/views/Item.vue';
import Bom from '@/views/Bom.vue';
import Process from "@/views/process.vue";
import { compile } from "vue";
import Productionplan from "@/views/Productionplan.vue";
import MaLotList from "@/views/MaLotList.vue";
import MOrderForm from '@/views/MOrderForm.vue';
import MOrdersList from '@/views/MOrdersList.vue';



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
  // {
  //   path: "/home",
  //   name: "home",
  //   component: () => import("../views/Home.vue"),
  // },
  {
    path: "/leetest",
    name: "Leetest",
    component: Leetest,
  },
  {

    path: "/process",
    name: "Process",
    component: Process,

    // 품목관리 페이지
    path: '/items',
    name: 'ItemList',
    component: ItemList,
    meta: { title: '품목 관리' }
  },
  {
    path: '/boms',
    name: 'Bom',
    component: Bom,
    meta: { title: 'BOM 관리' }

  },
  {
    path: '/plan',
    name: 'ProductionPlan',
    component: Productionplan,
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
