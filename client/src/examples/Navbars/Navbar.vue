<template>
  <nav
    class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl"
    v-bind="$attrs"
    id="navbarBlur"
    data-scroll="true"
    :class="store.isAbsolute ? 'mt-4' : 'mt-0'"
  >
    <div class="px-3 py-1 container-fluid">
      <breadcrumbs :currentPage="currentRouteName" :color="color" />
      <div
        class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
        :class="store.isRTL ? 'px-0' : 'me-sm-4'"
        id="navbar"
      >
        <!-- <div
          class="pe-md-3 d-flex align-items-center"
          :class="store.isRTL ? 'me-md-auto' : 'ms-md-auto'"
        >
          <material-input id="search" label="Search here" />
        </div> -->
        <ul class="navbar-nav justify-content-end">
          <div class="btn-group" v-if="userStore.userId !== null">
            <span>{{userStore.userId}}님</span>
            <button @click="logout">로그아웃</button>
          </div>
          
          
          <!-- <li class="nav-item d-flex align-items-center">
            <router-link
              :to="{ name: 'SignIn' }"
              class="px-0 nav-link font-weight-bold lh-1"
              :class="color ? color : 'text-body'"
            >
              <i class="material-icons" :class="store.isRTL ? 'ms-sm-2' : 'me-sm-1'">
                account_circle
              </i>
            </router-link>
          </li> -->

          <!-- <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a
              href="#"
              @click="toggleSidebar"
              class="p-0 nav-link text-body lh-1"
              id="iconNavbarSidenav"
            >
              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
              </div>
            </a>
          </li> -->

          <!-- <li class="px-3 nav-item d-flex align-items-center">
            <a
              class="p-0 nav-link lh-1"
              @click="store.toggleConfigurator"
              :class="color ? color : 'text-body'"
            >
              <i class="material-icons fixed-plugin-button-nav cursor-pointer">
                settings
              </i>
            </a>
          </li> -->
          
          <li
            class="nav-item dropdown d-flex align-items-center"
            :class="store.isRTL ? 'ps-2' : 'pe-2'"
          >
            <a
              href="#"
              class="p-0 nav-link lh-1"
              :class="[color ? color : 'text-body', showMenu ? 'show' : '']"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              @click="showMenu = !showMenu"
            >
              <!-- <i class="material-icons cursor-pointer"> notifications </i> -->
            </a>
            <ul
              class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4"
              :class="showMenu ? 'show' : ''"
              aria-labelledby="dropdownMenuButton"
            >
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
import { useUserStore } from "@/store/user"; // Pinia store import
import { useConfigStore } from "@/store/index"; // Pinia store import

export default {
  name: "navbar",
  data() {
    return {
      showMenu: false,
      store: useUserStore(), // Pinia store 인스턴스
    };
  },
  computed : {
    userId(){
      return this.store.userId; // Pinia store에서 userId 가져오기  
    }
  },
  props: ["minNav", "color"],
  created() {
    this.minNav;
  },
  methods: {
    toggleSidebar() {
      this.store.navbarMinimize(); // Pinia action 호출
    },
    logout(){
   //this.userId = '';
    //localStorage.removeItem('userId');
    this.store.removeLoginId();
    this.$router.push("/login");
    }
  },
  components: {
    Breadcrumbs,
    MaterialInput,
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    userStore() {
      return useUserStore(); 
    }
  },
  
};
</script>
