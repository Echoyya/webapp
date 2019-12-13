import env from '@/functions/config'
const ua = navigator.userAgent
const os = (ua.includes('iPhone') && 'IOS') || (ua.includes('iPad') && 'IOS') || 'Android'
const now = new Date().getTime()
let commonLog = {}
let deviceId = ''

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

// Hive
function sendMsg(url) {
  // TODO  发送成功
  const s = document.createElement('img')
  s.height = 1
  s.width = 1
  s.src = url
}

export const initAna = function(appType, did, appInfo) {
  const gaKey = (appType === 1 && env.gaAndroidKey) || (appType === 2 && env.gaIosKey) || env.gaWapKey
  // eslint-disable-next-line no-undef
  ga('create', gaKey, 'auto')
  deviceId = did

  commonLog = {
    al: appInfo.lnCode || 'en', // App语言
    bst: '', // 用户绑卡状态
    car: appInfo.carrier || '',
    curp: document.title, // 当前页面
    cr: '',
    ct: '',
    dch: '', // 安装渠道标识
    dd: '' + window.devicePixelRatio, // 屏幕密度
    did: did,
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
    srcp: encodeURIComponent(document.referrer),
    ver: appInfo.versionName || '',
    tt: now,
    uid: 0
  }
}

const serializeMsg = msg => {
  for (const i in msg) {
    msg[i] = encodeURIComponent('' + msg[i]) // 防止入库hive失败
  }
  const param = {
    msg: msg
  }
  for (const i in commonLog) {
    param[i] = commonLog[i]
  }
  param['tt'] = new Date().getTime()
  param['durp'] = new Date().getTime() - now
  return JSON.stringify([param])
}

export const sendEvLog = msg => {
  const result = serializeMsg(msg)
  sendMsg(env.countlyServer + '/i?logtype=event&app_key=' + env.countlyAppKey + '&events=' + result + '&device_id=' + deviceId + '&timestamp=' + now)
  // TODO 换成fireBase
  // eslint-disable-next-line no-undef
  ga('send', {
    hitType: 'event',
    eventCategory: msg.category,
    eventAction: msg.action,
    eventLabel: msg.label,
    eventValue: 1
  })
}
