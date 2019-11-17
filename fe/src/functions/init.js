import Vue from 'vue'
import axios from 'axios'
import tokenMap from '@/functions/token'
import env from '@/functions/config'
import { getCookie, setCookie, randomString } from '@/functions/utils'
import errorPage from '@/components/error.vue'
import i18n from '@/i18n/'
Vue.config.productionTip = false
const countlyServer = env.countlyServer
const countlyAppKey = env.countlyAppKey
const gaIosKey = env.gaIosKey
const gaWapKey = env.gaWapKey
const gaAndroidKey = env.gaAndroidKey

// ga
;(function(i, s, o, g, r, a, m) {
  i.GoogleAnalyticsObject = r
  // eslint-disable-next-line no-unused-expressions
  ;(i[r] =
    i[r] ||
    function() {
      // eslint-disable-next-line no-extra-semi
      ;(i[r].q = i[r].q || []).push(arguments)
      // eslint-disable-next-line no-sequences
    }),
    (i[r].l = 1 * new Date())
  // eslint-disable-next-line no-unused-expressions
  ;(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0])
  a.async = 1
  a.src = g
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga')
// countly
function sendMsg(url) {
  const s = document.createElement('img')
  s.height = 1
  s.width = 1
  s.src = url
}

let appType = 0

let appInfo = window.getChannelId && window.getChannelId.jsGetHeadInfo && window.getChannelId.jsGetHeadInfo()
let token = tokenMap['NG']
let language = 'en' // default language en
if (appInfo) {
  appInfo = JSON.parse(appInfo)
  token = appInfo.token
  language = appInfo.lnCode
  appType = 1
  Vue.prototype.$appVersion = appInfo.versionCode
} else {
  appInfo = {}
  token = window.getChannelId && window.getChannelId.getToken && window.getChannelId.getToken()
  language = navigator.language
  if (token) {
    appType = 1
    setCookie('token', token)
  } else {
    const ua = navigator.userAgent
    if (ua.indexOf('iPhone') >= 0) {
      const uaArr = ua.split(' ')
      if (uaArr[uaArr.length - 1].indexOf('Mobile/') >= 0) {
        appType = 2
      } else {
        appType = 0
      }
    } else {
      appType = 0
    }
    token = getCookie('token') || tokenMap['NG']
  }
}

if (appType == 1) {
  Vue.prototype.$platform = 'Android'
} else if (appType == 2) {
  Vue.prototype.$platform = 'Ios'
} else {
  Vue.prototype.$platform = 'Web'
}

let langObj = i18n.en
if (language.indexOf('fr') >= 0) {
  langObj = i18n.fy
} else if (language.indexOf('sw') >= 0) {
  langObj = i18n.sy
} else if (language.indexOf('pt') >= 0) {
  langObj = i18n.py
} else {
  langObj = i18n.en
}

// 多语言函数
Vue.prototype.$t = function(str, arr) {
  const s = str.split('.')
  let tmp = langObj
  s.forEach(item => {
    if (tmp[item]) {
      tmp = tmp[item]
    }
  })

  if (typeof tmp == 'string') {
    if (arr && arr.length > 0) {
      arr.forEach((item, index) => {
        tmp = tmp.replace(`{${index}}`, item)
      })
      return tmp
    } else {
      return tmp
    }
  } else {
    return ''
  }
}

setCookie('token', token)
Vue.prototype.$appType = appType
Vue.prototype.$token = token

let deviceId = appInfo.deviceId || getCookie('_stdid') || randomString(32)

// 对deviceID 针对ios特例化
if (appType == 2) {
  deviceId = deviceId + '_h5ios'
}

const ua = navigator.userAgent
const os = (appType === 1 && 'Android') || (appType === 2 && 'IOS') || (ua.includes('iPhone') && 'IOS') || (ua.includes('iPad') && 'IOS') || 'Android'
const gaKey = (appType === 1 && gaAndroidKey) || (appType === 2 && gaIosKey) || gaWapKey
const now = new Date().getTime()
// eslint-disable-next-line no-undef
ga('create', gaKey, 'auto')

const commonLog = {
  al: appInfo.lnCode || 'en', // App语言
  bst: '', // 用户绑卡状态
  car: appInfo.carrier || '',
  curp: document.title, // 当前页面
  cr: '',
  ct: '',
  dch: '', // 安装渠道标识
  dd: '' + window.devicePixelRatio, // 屏幕密度
  desp: '', // 跳转页面
  durp: 0,
  di: appInfo.phoneModel || '', // 设备信息
  dr: '', // 屏幕分辨率
  iid: '', // 安装唯一标识
  lst: appInfo.loginState || 'a', // 用户登录状态
  lt: 'event', // 报数类型
  lv: '1.0.0',
  nt: appInfo.network || '', // 网络类型
  os: os,
  osl: navigator.language, // 系统语言
  osv: '', // 系统版本
  pid: '', //	播放ID
  pro: '', // 推广渠道标识
  pst: '', // 用户付费状态
  sid: '', // Session ID
  sim: appInfo.operator || '', // 手机卡运营商
  srcp: document.referrer,
  ver: appInfo.versionName || '',
  tt: now,
  uid: 0
}

const serializeMsg = msg => {
  for (const i in msg) {
    msg[i] = '' + msg[i]
  }
  const param = {
    msg: msg
  }
  for (const i in commonLog) {
    param[i] = commonLog[i]
  }
  param['did'] = deviceId
  return JSON.stringify([param])
}

const sendEvLog = msg => {
  const result = serializeMsg(msg)
  sendMsg(countlyServer + '/i?logtype=event&app_key=' + countlyAppKey + '&events=' + result + '&device_id=' + deviceId + '&timestamp=' + now)

  // eslint-disable-next-line no-undef
  // 在未迁firebase之前暂时不用ga
  // ga('send', {
  //   hitType: 'event',
  //   eventCategory: msg.category,
  //   eventAction: msg.action,
  //   eventLabel: msg.label,
  //   eventValue: 1
  // })
}

axios.defaults.baseURL = env.apiUrl
axios.defaults.headers.token = token

axios.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(error.toJSON())
    sendEvLog({
      category: 'h5_open',
      action: 'api_error',
      label: encodeURIComponent(error.config.url),
      value: error.message,
      postdata: encodeURIComponent(error.config.data),
      token: error.config.headers.token
    })

    return Promise.reject(error)
  }
)

Vue.prototype.$axios = axios
Vue.prototype.$sendEvLog = sendEvLog

export const initPage = function(page) {
  axios
    .get('/cms/users/me')
    .then(res => {
      Vue.prototype.$serverTime = res.headers.server_time

      if (res.data && res.data.id) {
        // 有用户信息
        const role = res.data.roleName
        deviceId = res.data.deviceID
        Vue.prototype.$deviceId = res.data.deviceID
        Vue.prototype.$countryCode = res.data.countryCode
        Vue.prototype.$isLogin = role && role.toUpperCase() !== 'ANONYMOUS'
        Vue.prototype.$user = res.data
      } else {
        // 无用户信息 本地匿名token
        Vue.prototype.$deviceId = deviceId
        Vue.prototype.$countryCode = 'NG'
        Vue.prototype.$isLogin = false
        Vue.prototype.$user = {
          id: 9999,
          userName: 'H5-ANY',
          nickNaem: 'H5-ANY',
          head: 'https://cdn.startimestv.com/head/h_d.png'
        }
      }
      new Vue({
        render: h => h(page)
      }).$mount('#app')
      setCookie('_stdid', deviceId)
      sendEvLog({
        category: 'h5_open',
        action: 'page_init_start',
        label: location.pathname,
        value: now
      })
    })
    .catch(() => {
      new Vue({
        render: h => h(errorPage)
      }).$mount('#app')
      deviceId = 'h5diviceidpageiniterrorunder52000'
      sendEvLog({
        category: 'h5_open',
        action: 'get_me_error',
        label: location.pathname,
        value: appType
      })
      // TODO 登录状态失效
    })
}
