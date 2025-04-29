<template>
  <aside
    id="sidenav-main"
    class="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 ms-3"
    :class="`${configStore.isRTL ? 'me-3 rotate-caret fixed-end' : 'fixed-start ms-3'} ${configStore.sidebarType}`"
  >
    <div class="sidenav-header">
      <i
        class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
        aria-hidden="true"
        id="iconSidenav"
      ></i>
      <a class="navbar-brand" href="/">
        <!-- <img
          :src="
            configStore.sidebarType === 'bg-white' ||
            (configStore.sidebarType === 'bg-transparent' && !configStore.isDarkMode)
              ? logoDark
              : logo
          "
          class="navbar-brand-img h-100"
          alt="main_logo"
        /> -->
        <span class="ms-6"> <!--nav 로고-->
          <img src="Logo.png" alt="logo" class="nav-logo"/> 
        </span>
      </a>
    </div>
    <hr class="horizontal light mt-0 mb-2" />
    <sidenav-list />
  </aside>
</template>

<script setup>
import { useConfigStore } from "@/store";
import SidenavList from "./SidenavList.vue";
import logo from "@/assets/img/logo-ct.png";
import logoDark from "@/assets/img/logo-ct-dark.png";

const configStore = useConfigStore();
</script>
<style>
  .sidenav .navbar-brand {
    padding : 5px !important;
    margin : 0 auto !important;
    background-color: #fff !important;
  }
  .nav-logo {
    max-width: 100px !important;
    width: 100% !important;
  }
</style>
