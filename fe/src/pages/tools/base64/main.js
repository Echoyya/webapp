import { Base64 } from 'js-base64'

const str = 'com.star.mobile.video.activity.BrowserActivity?loadUrl=' + window.location.href

const btoaStr = window.btoa(str)
const base64Str = Base64.encode(str.replace(/&/g, '**'))

console.log(base64Str)
console.log(btoaStr)
