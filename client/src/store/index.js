import { defineStore } from "pinia";

// 'config'라는 이름의 스토어를 정의합니다.
export const useConfigStore = defineStore('config', {
  // state: 애플리케이션 전역에서 관리할 데이터 정의
  state: () => ({
    hideConfigButton: false,
    isPinned: true,
    showConfig: false,
    sidebarType: "bg-white",
    isRTL: false,
    color: "info",
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    isDarkMode: false,
    navbarFixed: "position-sticky blur shadow-blur left-auto top-1 z-index-sticky px-0 mx-4",
    absolute: "position-absolute px-4 mx-0 w-100 z-index-2",
    subMenu : [],
  }),

  // actions: 상태를 변경하거나 로직을 실행하는 메서드 정의
  actions: {
    choiceSubMenu(subMenu){
      this.subMenu = subMenu;
      //받아온 값을 subMenu에 저장한다.
    },
    // 설정 창 표시 여부를 토글
    toggleConfigurator() {
      this.showConfig = !this.showConfig;
    },

    // 사이드바 고정 여부를 토글
    navbarMinimize() {
      const sidenav_show = document.querySelector(".g-sidenav-show");

      if (sidenav_show?.classList.contains("g-sidenav-pinned")) {
        sidenav_show.classList.remove("g-sidenav-pinned");
        this.isPinned = true;
      } else {
        sidenav_show?.classList.add("g-sidenav-pinned");
        this.isPinned = false;
      }
    },

    // 네비게이션 고정 여부를 토글
    toggleNavbarFixed() {
      this.isNavFixed = !this.isNavFixed;
    },

    // 화면 요소들 (Navbar, Sidenav, Footer) 표시 여부를 일괄 토글
    toggleEveryDisplay() {
      this.showNavbar = !this.showNavbar;
      this.showSidenav = !this.showSidenav;
      this.showFooter = !this.showFooter;
    },

    // 설정 버튼 숨김 여부를 토글
    toggleHideConfig() {
      this.hideConfigButton = !this.hideConfigButton;
    },

    // 테마 색상 변경
    setColor(payload) {
      this.color = payload;
    },
  },

  // getters: 상태를 기반으로 계산된 값을 반환 (현재는 비어 있음)
  getters: {
    // 필요하면 예를 들어 여기서 'isDark' 같은 getter 추가 가능
    // 예) isDarkMode: (state) => state.isDarkMode
  }
});
