import Vue from 'vue'
import axios from 'axios'
import tokenMap from '@/functions/token'
import env from '@/functions/config'
import { getCookie, setCookie, randomString } from '@/functions/utils'
import i18n from '@/i18n/'
import { initAna, sendEvLog } from '@/functions/analysis.js'
import errorPage from '@/components/error'
import updateComponent from '@/components/iosUpdate'

Vue.config.productionTip = false

let appType = 0
let token = ''
let language = 'en'
let langObj = i18n.en
let iosBridge = null
let appInfo = null
let pageComponent = ''
let updatePage = updateComponent

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
  window.WVJBCallbacks = [callback]
  var WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(function() {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}

export const initPage = function(page, update) {
  pageComponent = page

  updatePage = update ? update : updateComponent

  if (!window.getChannelId) {
    setupWebViewJavascriptBridge(function(bridge) {
      iosBridge = bridge
      basicBridgeInfo()
    })
  } else {
    // 因为ios的方法实在回调队列里
    basicBridgeInfo()
  }
}

function basicBridgeInfo() {
  appInfo = window.getChannelId && window.getChannelId.jsGetHeadInfo && window.getChannelId.jsGetHeadInfo()
  if (appInfo) {
    appInfo = JSON.parse(appInfo)
    support()
  } else {
    if (iosBridge) {
      iosBridge.callHandler('jsGetHeadInfo', '', function(response) {
        appInfo = JSON.parse(response)
        support()
      })
    } else {
      support()
    }
  }
}

function support() {
  if (appInfo) {
    appType = appInfo.client == 'android' ? 1 : 2
    token = appInfo.token
    language = appInfo.lnCode
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
          new Vue({
            render: h => h(updatePage)
          }).$mount('#app')
          // TODO 发埋点
          return
        } else {
          appType = 0
        }
      } else {
        appType = 0
      }
    }
  }

  setCookie('token', token)

  // 初始化多语言
  if (language.indexOf('fr') >= 0) {
    langObj = i18n.fy
    language = 'fr'
  } else if (language.indexOf('sw') >= 0) {
    langObj = i18n.sy
    language = 'sw'
  } else if (language.indexOf('pt') >= 0) {
    langObj = i18n.py
    language = 'pt'
  } else {
    langObj = i18n.en
    language = 'en'
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

  // 初始化deviceId
  let deviceId = appInfo.deviceId
  if (!deviceId) {
    deviceId = getCookie('_stdid')
    if (!deviceId) {
      deviceId = randomString(32)
      if (appType == 1) {
        deviceId += '_oldandoid' // <android 5.20
      } else if (appType == 2) {
        deviceId += '_oldios' // <ios 3.9
      }
    }
  }

  // 初始化报数
  initAna(appType, deviceId, appType)

  // 初始化平台信息
  if (appType == 1) {
    Vue.prototype.$platform = 'Android'
  } else if (appType == 2) {
    Vue.prototype.$platform = 'iOS'
  } else {
    Vue.prototype.$platform = 'web'
  }

  axios.defaults.timeout = 10000 // ajax timeout 10s
  axios.defaults.baseURL = env.apiUrl
  axios.defaults.headers.token = token
  Vue.prototype.$axios = axios
  Vue.prototype.$sendEvLog = sendEvLog
  Vue.prototype.$lang = language
  Vue.prototype.$appType = appType
  Vue.prototype.$token = token
  Vue.prototype.$deviceId = deviceId
  Vue.prototype.$iosBridge = iosBridge

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

      // TODO 登录状态失效
      return Promise.reject(error)
    }
  )

  axios
    .get('/cms/users/me')
    .then(res => {
      Vue.prototype.$serverTime = res.headers.server_time
      if (res.data && res.data.id) {
        // 有用户信息
        const role = res.data.roleName
        Vue.prototype.$countryCode = res.data.countryCode
        Vue.prototype.$isLogin = role && role.toUpperCase() !== 'ANONYMOUS'
        Vue.prototype.$user = res.data
      } else {
        // 无用户信息 本地匿名token
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
        render: h => h(pageComponent)
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
