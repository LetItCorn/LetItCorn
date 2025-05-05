import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import MaterialDashboard from "./material-dashboard";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from "axios";


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const appInstance = createApp(App);
axios.defaults.baseURL = '';
appInstance.use(pinia);
appInstance.use(store);
appInstance.use(router);
appInstance.use(MaterialDashboard);

appInstance.component('VueDatePicker', VueDatePicker);
appInstance.component('AgGridVue', AgGridVue);

appInstance.mount("#app");
