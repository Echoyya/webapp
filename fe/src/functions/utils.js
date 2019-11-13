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

export const animateCSS = function(element, animationName, callback) {
  const node = element

  function handleAnimationEnd() {
    node.classList.remove('animated', animationName)
    node.removeEventListener('animationend', handleAnimationEnd)
    node.removeEventListener('webkitAnimationEnd', handleAnimationEnd)

    if (typeof callback === 'function') callback()
  }

  node.addEventListener('animationend', handleAnimationEnd)
  node.addEventListener('webkitAnimationEnd', handleAnimationEnd)
  node.classList.add('animated', animationName)
}

export const getBrowser = function() {
  if (!process.client) return {}
  const ua = window.navigator.userAgent || ''
  const isAndroid = /android/i.test(ua)
  const isIos = /iphone|ipad|ipod/i.test(ua)
  const systemInfo = /Android [\d.]*/i.exec(ua)
  const browserInfo = /Chrome\/[\d.]*/i.exec(ua)
  const browserVer = browserInfo ? parseFloat(browserInfo[0].split('/')[1]) : -1
  const androidVer = systemInfo ? parseFloat(systemInfo[0].split('/')[1]) : -1

  return {
    isAndroid,
    isIos,
    browserVer,
    androidVer,
    ua
  }
}
