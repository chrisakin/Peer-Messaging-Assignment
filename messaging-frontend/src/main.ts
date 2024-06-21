import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";


const VueApp = createApp(App);
VueApp.use(router);
const pinia = createPinia();
VueApp.use(pinia);
VueApp.mount("#app");
