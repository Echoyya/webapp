import Vue from "vue";
import axios from "axios";
import tokenMap from "@/functions/token";
import env from "@/functions/config";
import { getCookie, setCookie } from "@/functions/utils";
import App from "./App.vue";
import errorPage from "./error.vue";

Vue.config.productionTip = false;

const countlyServer = env.countlyServer;
const countlyAppKey = env.countlyAppKey;
const gaIosKey = env.gaIosKey;
const gaWapKey = env.gaWapKey;
const gaAndroidKey = env.gaAndroidKey;

// ga
(function(i, s, o, g, r, a, m) {
  i.GoogleAnalyticsObject = r;
  // eslint-disable-next-line no-unused-expressions
  (i[r] =
    i[r] ||
    function() {
      (i[r].q = i[r].q || []).push(arguments);
      // eslint-disable-next-line no-sequences
    }),
    (i[r].l = 1 * new Date());
  // eslint-disable-next-line no-unused-expressions
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(
  window,
  document,
  "script",
  "https://www.google-analytics.com/analytics.js",
  "ga"
);

// countly
function sendMsg(url) {
  const s = document.createElement("img");
  s.height = 1;
  s.width = 1;
  s.src = url;
}

let appType = 0;
let token = window.getToken && window.getToken();
if (token) {
  appType = 1;
  setCookie("token", token);
} else {
  appType = 0;
  token = getCookie("token") || tokenMap["NG"];
}
Vue.prototype.$appType = appType;

const ua = navigator.userAgent;
const os =
  (appType === 1 && "Android") ||
  (appType === 2 && "IOS") ||
  (ua.includes("iPhone") && "IOS") ||
  (ua.includes("iPad") && "IOS") ||
  "Android";
const gaKey =
  (appType === 1 && gaAndroidKey) || (appType === 2 && gaIosKey) || gaWapKey;
const now = new Date().getTime();
// eslint-disable-next-line no-undef
ga("create", gaKey, "auto");

const commonLog = {
  al: "en", // App语言
  bst: "", // 用户绑卡状态
  car: "",
  curp: document.title, // 当前页面
  cr: "",
  ct: "",
  dch: "", // 安装渠道标识
  dd: "" + window.devicePixelRatio, // 屏幕密度
  desp: "", // 跳转页面
  durp: 0,
  di: "", // 设备信息
  did: "", // 设备唯一标识
  dr: "", // 屏幕分辨率
  iid: "", // 安装唯一标识
  lst: "a", // 用户登录状态
  lt: "event", // 报数类型
  lv: "1.0.0",
  nt: "", // 网络类型
  os: os,
  osl: navigator.language, // 系统语言
  osv: "", // 系统版本
  pid: "", //	播放ID
  pro: "", // 推广渠道标识
  pst: "", // 用户付费状态
  sid: "", // Session ID
  sim: "", // 手机卡运营商
  srcp: document.referrer,
  ver: "",
  tt: now,
  uid: 0
};

const serializeMsg = (msg, type) => {
  for (const i in msg) {
    msg[i] = "" + msg[i];
  }
  const param = {
    msg: msg
  };
  for (const i in commonLog) {
    param[i] = commonLog[i];
  }
  param.lt = type || "event" || "pv";
  return JSON.stringify([param]);
};

axios.defaults.baseURL = "http://qa.upms.startimestv.com"; // TODO 环境变量;
axios.defaults.headers.token = token;

axios.interceptors.request.use(
  function(config) {
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

Vue.prototype.$axios = axios;

axios
  .get("/cms/users/me")
  .then(res => {
    const role = res.data.roleName;
    Vue.prototype.$serverTime = res.headers.server_time;
    Vue.prototype.$deviceId = res.data.deviceID;
    Vue.prototype.$countryCode = res.data.countryCode;
    Vue.prototype.$isLogin = role && role.toUpperCase() !== "ANONYMOUS";
    Vue.prototype.$user = res.data;

    const sendEvLog = msg => {
      const result = serializeMsg(msg, "event");
      sendMsg(
        countlyServer +
          "/i?logtype=event&app_key=" +
          countlyAppKey +
          "&events=" +
          result +
          "&device_id=" +
          res.data.deviceID +
          "&timestamp=" +
          now
      );

      // eslint-disable-next-line no-undef
      ga("send", {
        hitType: "event",
        eventCategory: msg.category,
        eventAction: msg.action,
        eventLabel: msg.label,
        eventValue: 1
      });
    };

    Vue.prototype.$sendEvLog = sendEvLog;

    sendEvLog({
      category: "h5_open",
      action: "page_init_start",
      label: location.pathname,
      value: now
    });
    new Vue({
      render: h => h(App)
    }).$mount("#app");
  })
  .catch(() => {
    new Vue({
      render: h => h(errorPage)
    }).$mount("#app");
    // const res = err["response"];
    // Vue.prototype.$serverTime = res.headers.date; //TODO format
    // Vue.prototype.$deviceId = res.data.deviceID; // TODO 匿名
    // Vue.prototype.$countryCode = res.data.countryCode;
    // Vue.prototype.$isLogin = false;
    // 登录状态失效
  });
