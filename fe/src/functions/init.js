import Vue from 'vue'
import axios from 'axios'
import tokenMap from '@/functions/token'
import env from '@/functions/config'
import { getCookie, setCookie, randomString } from '@/functions/utils'
import errorPage from '@/components/error.vue'
import i18n from '@/i18n/'
import { initAna, sendEvLog } from '@/functions/analysis.js'

Vue.config.productionTip = false

let appType = 0
let token = ''
let language = 'en' // default language en
let langObj = i18n.en

let appInfo = window.getChannelId && window.getChannelId.jsGetHeadInfo && window.getChannelId.jsGetHeadInfo()

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
  } else {
    token = getCookie('token') || tokenMap['NG']
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
  }
}
setCookie('token', token)

// 初始化平台信息
if (appType == 1) {
  Vue.prototype.$platform = 'Android'
} else if (appType == 2) {
  Vue.prototype.$platform = 'iOS'
} else {
  Vue.prototype.$platform = 'web'
}

// 初始化多语言
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

Vue.prototype.$appType = appType
Vue.prototype.$token = token

// 初始化deviceId
let deviceId = appInfo.deviceId
if (!deviceId) {
  deviceId = getCookie('_stdid')
  if (!deviceId) {
    deviceId = randomString(32)
    // 为了不混淆切能做必要的统计，对未得到deviceId在app中的情形进行特殊处理
    if (appType == 1) {
      deviceId += '_h5andoid'
    } else if (appType == 2) {
      deviceId += '_h5ios'
    }
  }
}

// 初始化报数
initAna(appType, deviceId, appType)

axios.defaults.timeout = 10000 // ajax timeout 10s
axios.defaults.baseURL = env.apiUrl
axios.defaults.headers.token = token
Vue.prototype.$axios = axios
Vue.prototype.$sendEvLog = sendEvLog

axios.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    sendEvLog({
      category: 'h5_open',
      action: 'api_error',
      label: error.config.url,
      value: error.message,
      postdata: error.config.data,
      token: error.config.headers.token
    })

    return Promise.reject(error)
  }
)

export const initPage = function(page) {
  axios
    .get('/cms/users/me')
    .then(res => {
      Vue.prototype.$serverTime = res.headers.server_time

      if (res.data && res.data.id) {
        // 有用户信息
        const role = res.data.roleName
        deviceId = res.data.deviceID
        initAna(appType, deviceId, appType)
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
        value: 1
      })
    })
    .catch(() => {
      new Vue({
        render: h => h(errorPage)
      }).$mount('#app')
      deviceId = 'h5diviceidpageiniterrorunder52000'
      initAna(appType, deviceId, appType)
      sendEvLog({
        category: 'h5_open',
        action: 'get_me_error',
        label: location.pathname,
        value: appType
      })
      // TODO 登录状态失效
    })
}
