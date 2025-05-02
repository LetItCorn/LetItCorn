<template>

  <nav class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl" v-bind="$attrs" id="navbarBlur" data-scroll="true" :class="store.isAbsolute ? 'mt-4' : 'mt-0'">
    <div class="px-3 py-1 container-fluid">
      <!-- <breadcrumbs :currentPage="currentRouteName" :color="color" /> -->
      <div class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4" id="navbar">
        <div class="nav-menu-container">
          <div v-for="menu in menus" class="nav-group" v-if="isLoggedIn">
            <!-- menuConfig의 키 값 for, click 이벤트 매개변수로 키값 넘김-->
            <button @click="selectedMenu(menu)" :class="{'active-menu':acvtiveMenu === menu}">{{ menu }}</button>
          </div>
        </div>
        <!-- <div class="pe-md-3 d-flex align-items-center ms-md-auto">
          <material-input id="search" label="Search here" />
        </div>  -->
        <ul class="navbar-nav login-container">
          <div class="login-group" v-if="isLoggedIn"> <!--로그인 사용자 정보-->
            <span class="login-name">{{userStore.empName}}님</span>
            <button @click="logout">로그아웃</button>
          </div>
          <!-- <li class="nav-item d-flex align-items-center">
            <router-link :to="{ name: 'SignIn' }" class="px-0 nav-link font-weight-bold lh-1"
              :class="color ? color : 'text-body'">
              <i class="material-icons me-sm-1">
                account_circle
              </i>
            </router-link>
          </li> -->
          <!-- <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a href="#" @click="toggleSidebar" class="p-0 nav-link text-body lh-1" id="iconNavbarSidenav">

              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
              </div>
            </a>

          </li> -->
          <!-- <li class="px-3 nav-item d-flex align-items-center">
            <a class="p-0 nav-link lh-1" @click="store.toggleConfigurator" :class="color ? color : 'text-body'">

              <i class="material-icons fixed-plugin-button-nav cursor-pointer">
                settings
              </i>
            </a>

          </li> -->
          <li class="nav-item dropdown d-flex align-items-center pe-2">
            <!-- <a href="#" class="p-0 nav-link lh-1" :class="[color ? color : 'text-body', showMenu ? 'show' : '']"
              id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" @click="showMenu = !showMenu">
              <i class="material-icons cursor-pointer"> notifications </i>
            </a> -->
            <ul class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4" :class="showMenu ? 'show' : ''"
              aria-labelledby="dropdownMenuButton">

              <!-- 알림 항목들 -->
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>

  import MaterialInput from "@/components/MaterialInput.vue";
  import Breadcrumbs from "../Breadcrumbs.vue";
  import { useConfigStore } from "@/store/index"; // Pinia store import
  import { useUserStore } from "@/store/user"; // Pinia store import
  import { menuConfig } from '@/utils/menuList';

  export default {
    name: "navbar",
    data() {
      return {
        acvtiveMenu: null,
        showMenu: false,
        store: useUserStore(), // Pinia store 인스턴스 -> 로그아웃 useConfigStroe에서 useUserStore로 변경
        // store/menuConfig
        menuStore : useConfigStore(),
        menuConfig,
      };

    },
  
  components: {
    Breadcrumbs,
    MaterialInput,
  },


    methods: {
      toggleSidebar() {
        this.store.navbarMinimize(); // Pinia action 호출
      },
      selectedMenu(menuName) {
        // 받아온 키값을 대응시켜 키에 일치하는 값을 store의 choiceSubMenu에 매개변수로 보낸다.
        let subMenuConfig = this.menuConfig[menuName];
        this.menuStore.choiceSubMenu(subMenuConfig);
        this.acvtiveMenu = menuName;
      },
      logout(){
        //this.userId = '';
        //localStorage.removeItem('userId');
        this.store.removeLoginId();
        this.$router.push("/login");
      },

    },
    userStore() {
      return useUserStore();
    },

    computed: {
      userId(){
      return this.store.userId; // Pinia store에서 userId 가져오기  
      },
      currentRouteName() {
        return this.$route.name;
      },
      userStore() {
      return useUserStore(); 
      },
      menus() {
        //menus에 munuConfig의 키들을 리턴한다.
        return Object.keys(this.menuConfig);
      },
      isLoggedIn() {
        // 로그인 여부를 확인하는 computed property
        return this.userId != undefined;
      }

    },
  
};
</script>
<style>
  .collapse navbar-collapse{
    font-size: 20px;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100%;
  }
  .nav-menu-container{
    display: flex;
    justify-content: center;
    flex: 1;
  }
  .nav-group{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .nav-group button {
    background: none;
    border: none;
    color: #000 !important;
    text-decoration: none;
    font-size: 45px;
    margin-right: 100px;
  }
  .nav-group button:hover {
    color: #1900ff !important;
    font-weight: bold;
  }
  /* active 효과 활성화 */
  .nav-group button.active-menu {
    color: #1900ff !important;
    font-weight: bold;
  }
  .login-group {
    font-size: 20px;
  }
  .login-name {
    color: #000 !important;
    margin-right: 20px;
  }
  .login-group button {
    border: none;
    text-decoration: none;
  }
</style>
