/* eslint-disable no-sequences */
import Vue from "vue";
import env from "@/functions/config";

const evCountlyServer = env.evCountlyServer;
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

const appType = store.state.appType;
const ua = navigator.userAgent;
const deviceInfo = ua.match(/\(([^)]*)\)/)[1].split(";");
const swidth = screen.width * window.devicePixelRatio;
const sheight = screen.height * window.devicePixelRatio;
const os =
  (appType === 1 && "Android") ||
  (appType === 2 && "IOS") ||
  (ua.includes("iPhone") && "IOS") ||
  (ua.includes("iPad") && "IOS") ||
  "Android";
const gaKey =
  (appType === 1 && gaAndroidKey) || (appType === 2 && gaIosKey) || gaWapKey;
let utmSource = "";
let utmMedium = "";
let utmCampaign = "";
const referrer = query.referrer;
const now = new Date().getTime();
ga("create", gaKey, "auto");

const commonLog = {
  al: store.state.langType, // App语言
  bst: store.state.user && store.state.user.smartCartCount, // 用户绑卡状态
  car: store.state.carrier,
  curp: document.title, // 当前页面
  cr: store.state.country.name,
  ct: "",
  dch: "", // 安装渠道标识
  dd: "" + window.devicePixelRatio, // 屏幕密度
  desp: "", // 跳转页面
  durp: 0,
  di:
    store.state.phoneModel ||
    deviceInfo[deviceInfo.length - 1].split("like")[0], // 设备信息
  did: store.state.deviceId, // 设备唯一标识
  dr: swidth + "x" + sheight, // 屏幕分辨率
  iid: store.state.gaClientId, // 安装唯一标识
  lst:
    store.state.user && store.state.user.roleName !== "ANONYMOUS" ? "l" : "a", // 用户登录状态
  lt: "pv", // 报数类型
  lv: "1.0.0",
  nt: "", // 网络类型
  os: os,
  osl: navigator.language, // 系统语言
  osv: "", // 系统版本
  pid: "", //	播放ID
  pro: utmSource + "/" + utmMedium + "_" + utmCampaign, // 推广渠道标识
  pst: "", // 用户付费状态
  sid: "", // Session ID
  sim: store.state.carrier, // 手机卡运营商
  srcp: document.referrer,
  ver: store.state.appVersion,
  tt: now,
  uid: parseInt(store.state.user.id) || 0
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

const sendEvLog = msg => {
  const result = serializeMsg(msg, "event");
  sendMsg(
    evCountlyServer +
      "/i?logtype=event&app_key=" +
      countlyAppKey +
      "&events=" +
      result +
      "&device_id=" +
      store.state.deviceId +
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

Vue.prototype.sendEvLog = sendEvLog;

sendEvLog({
  category: "h5_open",
  action: "page_init_start",
  label: location.pathname,
  value: now
});
