<template>
  <sidenav
    :custom_class="store.color"
    :class="[store.isRTL ? 'fixed-end' : 'fixed-start']"
    v-if="store.showSidenav"
  />
  <main
    class="main-content position-relative max-height-vh-100 h-100 overflow-x-hidden"
  >
    <!-- nav -->
    <navbar
      :class="[store.isNavFixed ? store.navbarFixed : '', store.isAbsolute ? store.absolute : '']"
      :color="store.isAbsolute ? 'text-white opacity-8' : ''"
      :minNav="store.navbarMinimize"
      v-if="store.showNavbar"
    />
    <router-view />
    <app-footer v-show="store.showFooter" />
    <configurator
      :toggle="store.toggleConfigurator"
      :class="[store.showConfig ? 'show' : '', store.hideConfigButton ? 'd-none' : '']"
    />
  </main>
</template>

<script>
import Sidenav from "./examples/Sidenav";
import Configurator from "@/examples/Configurator.vue";
import Navbar from "@/examples/Navbars/Navbar.vue";
import AppFooter from "@/examples/Footer.vue";
import { useConfigStore } from "@/store/index"; // Pinia store import

export default {
  name: "App",
  components: {
    Sidenav,
    Configurator,
    Navbar,
    AppFooter,
  },
  data() {
    return {
      store: useConfigStore(), // Pinia store 인스턴스
    };
  },
  beforeMount() {
    this.store.isTransparent = "bg-transparent"; // 필요하면 store에 isTransparent 정의해둬야 해

    const sidenav = document.getElementsByClassName("g-sidenav-show")[0];

    if (window.innerWidth > 1200) {
      sidenav.classList.add("g-sidenav-pinned");
    }
  },
};
</script>
