import { createApp } from "vue";
// import "./style.css";
import App from "./App.vue";
import router from "./router";
import api from "./api/index";
const app = createApp(App);
router.beforeEach((to) => {
  const token = localStorage.getItem("h5_token");
  if (!token && to.path !== "/login") {
    return "/login";
  } else if (token && to.path === "/login") {
    return "/";
  } else {
    return true;
  }
});
app.use(router);
//这个方法是在vue实例上写了一个属性$api，
// 从而在外面组件调用api方法时，先获取vue实例，
// 拿到过后调用里面的$api中的api方法即可
app.config.globalProperties.$api = api;
app.mount("#app");
