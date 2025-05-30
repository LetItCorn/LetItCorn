<template>
  <div class="fixed-plugin">
    <a
      class="px-3 py-2 fixed-plugin-button text-dark position-fixed"
      @click="toggle"
    >
      <i class="material-icons py-2">settings</i>
    </a>
    <div class="shadow-lg card">
      <div class="pt-3 pb-0 bg-transparent card-header">
        <div class="float-start">
          <h5 class="mt-3 mb-0">Material UI Configurator</h5>
          <p>See our dashboard options.</p>
        </div>
        <div class="mt-4 float-end" @click="toggle">
          <button class="p-0 btn btn-link text-dark fixed-plugin-close-button">
            <i class="material-icons">clear</i>
          </button>
        </div>
      </div>

      <hr class="my-1 horizontal dark" />
      <div class="pt-0 card-body pt-sm-3">
        <div>
          <h6 class="mb-0">Sidebar Colors</h6>
        </div>
        <a href="#" class="switch-trigger background-color">
          <div class="my-2 badge-colors text-start" >
            <span class="badge filter bg-gradient-primary" @click="sidebarColor('primary')"></span>
            <span class="badge filter bg-gradient-dark" @click="sidebarColor('dark')"></span>
            <span class="badge filter bg-gradient-info" @click="sidebarColor('info')"></span>
            <span class="badge filter bg-gradient-success" @click="sidebarColor('success')"></span>
            <span class="badge filter bg-gradient-warning" @click="sidebarColor('warning')"></span>
            <span class="badge filter bg-gradient-danger" @click="sidebarColor('danger')"></span>
          </div>
        </a>

        <div class="mt-3">
          <h6 class="mb-0">Sidenav Type</h6>
          <p class="text-sm">Choose between 2 different sidenav types.</p>
        </div>
        <div class="d-flex">
          <button
            id="btn-dark"
            class="px-3 mb-2 btn bg-gradient-dark"
            :class="store.sidebarType === 'bg-gradient-dark' ? 'active' : ''"
            @click="sidebar('bg-gradient-dark')"
          >
            Dark
          </button>
          <button
            id="btn-transparent"
            class="px-3 mb-2 btn bg-gradient-dark ms-2"
            :class="store.sidebarType === 'bg-transparent' ? 'active' : ''"
            @click="sidebar('bg-transparent')"
          >
            Transparent
          </button>
          <button
            id="btn-white"
            class="px-3 mb-2 btn bg-gradient-dark ms-2"
            :class="store.sidebarType === 'bg-white' ? 'active' : ''"
            @click="sidebar('bg-white')"
          >
            White
          </button>
        </div>

        <p class="text-sm d-xl-none d-block mt-2">
          You can change the sidenav type just on desktop view.
        </p>

        <hr class="horizontal dark my-3" />

        <div class="mt-2 d-flex">
          <h6 class="mb-0">Light / Dark</h6>
          <div class="form-check form-switch ps-0 ms-auto my-auto">
            <input
              class="form-check-input mt-1 ms-auto"
              type="checkbox"
              :checked="store.isDarkMode"
              @click="darkMode"
            />
          </div>
        </div>

        <hr class="horizontal dark my-sm-4" />

        <a
          class="btn btn-outline-dark w-100"
          href="https://www.creative-tim.com/learning-lab/vue/overview/material-dashboard/"
        >
          View documentation
        </a>

        <div class="text-center w-100">
          <h6 class="mt-3">Thank you for sharing!</h6>
          <a
            href="https://twitter.com/intent/tweet?text=Check%20Vue%20Material%20Dashboard%202%20made%20by%20%40CreativeTim%20%23webdesign%20%23dashboard%20%23vuejs3&amp;url=https%3A%2F%2Fwww.creative-tim.com%2Fproduct%2Fvue-material-dashboard-2"
            class="mb-0 btn btn-dark me-2"
            target="_blank"
          >
            <i class="fab fa-twitter me-1" aria-hidden="true"></i> Tweet
          </a>
          <a
            href="https://www.facebook.com/sharer/sharer.php?u=https://www.creative-tim.com/product/vue-material-dashboard-2"
            class="mb-0 btn btn-dark me-2"
            target="_blank"
          >
            <i class="fab fa-facebook-square me-1" aria-hidden="true"></i> Share
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useConfigStore } from "@/store/index"; // pinia store import
import { activateDarkMode, deactivateDarkMode } from "@/assets/js/dark-mode";

export default {
  name: "configurator",
  props: ["toggle"],
  data() {
    return {
      store: useConfigStore(), // pinia store 사용
    };
  },
  methods: {
    sidebarColor(color = "success") {
      document.querySelector("#sidenav-main").setAttribute("data-color", color);
      this.store.setColor(color); // pinia action 호출
    },

    sidebar(type) {
      this.store.sidebarType = type;
    },

    setNavbarFixed() {
      if (this.$route.name !== "Profile" && this.$route.name !== "All Projects") {
        this.store.isNavFixed = !this.store.isNavFixed;
      }
    },

    darkMode() {
      if (this.store.isDarkMode) {
        this.store.isDarkMode = false;
        deactivateDarkMode();
      } else {
        this.store.isDarkMode = true;
        activateDarkMode();
      }
    },

    sidenavTypeOnResize() {
      let transparent = document.querySelector("#btn-transparent");
      let white = document.querySelector("#btn-white");
      if (window.innerWidth < 1200) {
        transparent.classList.add("disabled");
        white.classList.add("disabled");
      } else {
        transparent.classList.remove("disabled");
        white.classList.remove("disabled");
      }
    },
  },
  computed: {
    sidenavResponsive() {
      return this.sidenavTypeOnResize;
    },
  },
  beforeMount() {
    this.store.isTransparent = "bg-transparent";
    window.addEventListener("resize", this.sidenavTypeOnResize);
    window.addEventListener("load", this.sidenavTypeOnResize);
  },
};
</script>
