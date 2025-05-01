<template>
  <div class="w-auto h-auto collapse navbar-collapse max-height-vh-100 h-100" id="sidenav-collapse-main">
    <ul class="navbar-nav">
      <li class="nav-item" v-for="menu in list">
        <span>{{ menu }}</span>
        <ul class="navbar-nav">
          <li class="nav-item" v-for="item in menues[menu]">
            <sidenav-collapse url="#" :aria-controls="''" :collapse="false" :collapseRef="item.path" :navText="item.name">
            </sidenav-collapse>
          </li>
        </ul>

      </li>
      <!-- <li class="nav-item" v-for="menu in list">
        <sidenav-collapse  url="#" :aria-controls="''" v-bind:collapse="true" collapseRef="" :navText="menu">
          
            
              <SidenavCollapseItem v-for="item in menues[menu]" :refer="item.path" miniIcon="" :text="item.name"/>

            
        
         
        </sidenav-collapse>
            
    </li> -->
    <!-- <li class="nav-item">
      <sidenav-collapse url="#" :aria-controls="''" :collapse="false" collapseRef="tables" navText="영업">

        <template v-slot:icon>
           <i class="material-icons-round opacity-10 fs-5">table_view</i> 
        </template>
      </sidenav-collapse>
    </li>
    <li class="nav-item">

      <sidenav-collapse url="#" :aria-controls="''" :collapse="false" collapseRef="billing" navText="자재">

        <template v-slot:icon>
          \ <i class="material-icons-round opacity-10 fs-5">receipt_long</i> 
        </template>
      </sidenav-collapse>
    </li>

    <li class="nav-item">

      <sidenav-collapse url="#" :aria-controls="''" :collapse="false" collapseRef="rtl-page" navText="관리">

        <template v-slot:icon>
           <i class="material-icons-round opacity-10 fs-5">format_textdirection_r_to_l</i> 
        </template>
      </sidenav-collapse>
    </li>

    <li class="mt-3 nav-item">
      <h6 class="text-xs ps-4 text-uppercase font-weight-bolder text-white ms-2">
        ACCOUNT PAGES
      </h6>
    </li>
    <li class="nav-item">
      <sidenav-collapse url="#" :aria-controls="''" :collapse="false" collapseRef="profile" navText="Profile">
        <template v-slot:icon>
          <i class="material-icons-round opacity-10 fs-5">person</i>
        </template>
      </sidenav-collapse>
    </li>
    <li class="nav-item">
      <sidenav-collapse url="#" :aria-controls="''" :collapse="false" collapseRef="sign-in" navText="SignIn">
        <template v-slot:icon>
          <i class="material-icons-round opacity-10 fs-5">login</i>
        </template>
      </sidenav-collapse>
    </li>
    <li class="nav-item">
      <sidenav-collapse url="#" :aria-controls="''" :collapse="false" collapseRef="sign-up" navText="SignUp">
        <template v-slot:icon>
          <i class="material-icons-round opacity-10 fs-5">assignment</i>
        </template>
      </sidenav-collapse>
    </li>-->
    </ul>

    <div class="sidenav-footer position-absolute w-100 bottom-0">
      <!-- <div class="mx-3">
        <a
          class="btn mt-4 w-100"
          :class="`bg-gradient-${store.color}`"
          href="https://www.creative-tim.com/product/vue-material-dashboard-2-pro"
        >
          Upgrade to pro
        </a>
      </div> -->
    </div>

  </div>
</template>

<script>
  import SidenavCollapse from "./SidenavCollapse.vue";
  import SidenavCollapseItem from "./SidenavCollapseItem.vue";
  import {
    useConfigStore
  } from "@/store/index"; // Pinia store import


  export default {
    name: "SidenavList",
    props: {
      cardBg: String,
    },
    components: {
      SidenavCollapse,
      SidenavCollapseItem
    },
    data() {
      return {
        title: "Soft UI Dashboard PRO",
        controls: "dashboardsExamples",
        isActive: "active",
        store: useConfigStore(), // Pinia store 등록
        list: [],
        deepList: [],
        menues: {}
      };
    },
    methods: {
      mkDeepMenu(obj) {
        this.deepList = Object.keys(obj)
      },

    },
    watch: {
      "store.subMenu": {
        handler(newVal) {
          if (newVal) {
            this.list = Object.keys(newVal); // menuData의 키만 가져오기
            this.menues = newVal

          }
        },

      }
    },
  };
</script>
<style>
  .navbar-nav span {
    padding-left: 20px;
    color: #fff;
  }
</style>