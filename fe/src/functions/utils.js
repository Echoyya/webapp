export const setCookie = (name, value, time) => {
  if (!name) {
    return false
  }
  let now = new Date().getTime()
  if (time) {
    now = now + time
  } else {
    now = now + 1000 * 60 * 60 * 24 * 7
  }

  const expires = '; expires=' + new Date(now).toUTCString()

  document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + expires + '; domain=;path=/'
  return true
}

export const getCookie = name => {
  const value = document.cookie.replace(
    // eslint-disable-next-line no-useless-escape
    new RegExp(
      '(?:(?:^|.*;)\\s*' +
        // eslint-disable-next-line no-useless-escape
        encodeURIComponent(name).replace(/[\-\.\+\*]/g, '\\$&') +
        '\\s*\\=\\s*([^;]*).*$)|^.*$'
    ),
    '$1'
  )
  return decodeURIComponent(value) || null
}

export const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

export const formatAmount = num => {
  if (!isNaN(num)) {
    const arr = num.toString().split('.')
    if (arr[1]) {
      const tmp = Number(0 + '.' + arr[1]).toFixed(2)
      return arr[0].toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,') + '.' + tmp.toString().split('.')[1]
    } else {
      return arr[0].toString().replace(/\d+?(?=(?:\d{3})+$)/gim, '$&,')
    }
  } else {
    return ''
  }
}

export const formatTime = val => {
  if (val < 3600) {
    const min = Math.floor(val / 60) < 10 ? '0' + Math.floor(val / 60) : Math.floor(val / 60)
    const sec = Math.floor(val % 60) < 10 ? '0' + Math.floor(val % 60) : Math.floor(val % 60)
    return min + ':' + sec
  } else if (val >= 3600) {
    const hour = Math.floor(val / 3600) < 10 ? '0' + Math.floor(val / 3600) : Math.floor(val / 3600)
    const min = Math.floor((val % 3600) / 60) < 10 ? '0' + Math.floor((val % 3600) / 60) : Math.floor((val % 3600) / 60)
    const sec = Math.floor(val % 60) < 10 ? '0' + Math.floor(val % 60) : Math.floor(val % 60)
    return hour + ':' + min + ':' + sec
  }
}

export const getBrowser = function() {
  const ua = window.navigator.userAgent || ''
  const isAndroid = /android/i.test(ua)
  const isIos = /iphone|ipad|ipod/i.test(ua)
  const systemInfo = /Android [\d.]*/i.exec(ua)
  const browserInfo = /Chrome\/[\d.]*/i.exec(ua)
  const browserVer = browserInfo ? parseFloat(browserInfo[0].split('/')[1]) : -1
  let androidVer = -1
  if (systemInfo) {
    if (systemInfo.includes('/')) {
      androidVer = parseFloat(systemInfo[0].split('/')[1])
    } else {
      androidVer = parseFloat(systemInfo[0].split(' ')[1])
    }
  }

  return {
    isAndroid,
    isIos,
    browserVer,
    androidVer,
    ua
  }
}

export const randomString = function(length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var result = ''
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}
