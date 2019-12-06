import axios from 'axios'
import qs from 'qs'
import { getBrowser, getCookie, setCookie } from '@/functions/utils'
import env from '@/functions/config'

const browser = getBrowser()
const appleStore = 'https://itunes.apple.com/us/app/startimes/id1168518958?l=zh&ls=1&mt=8'

export const createIntent = function(page, host, path, scheme) {
    const target = page ? '?target=' + window.btoa(page.replace(/&/g, '**')) : ''
    host = host || 'platformapi'
    path = path || 'webtoapp'
    scheme = scheme || (browser.isIos ? 'startimes' : 'starvideo')
    return `intent://${host}/${path}${target}#Intent;scheme=${scheme};end`
}

export const createScheme = function(page, host, path, scheme) {
    const target = page ? '?target=' + window.btoa(page.replace(/&/g, '**')) : ''
    host = host || 'platformapi'
    path = path || 'webtoapp'
    scheme = scheme || (browser.isIos ? 'startimes' : 'starvideo')
    return `${scheme}://${host}/${path}${target}`
}

export const pageDlay = function(callback, second) {
    const timeout = second || 5000 // 手机卡顿的情况会比较慢
    const timerStart = new Date().getTime()
    let lastFired = new Date().getTime()
    if (browser.browserVer > 40) {
        const exam = () => {
            const now = new Date().getTime()
            if (now - lastFired < 100) {
                // 健康状态
                if (now - timerStart > timeout) {
                    if (!document.hidden) callback && callback()
                } else {
                    lastFired = now
                    window.requestAnimationFrame(exam)
                }
            }else{
                this.$refs.loading.finish()
            }
        }
        window.requestAnimationFrame(exam)
    } else {
        const interval = 200
        const deviation = 20
        const timer = setInterval(() => {
                const now = new Date().getTime()
                if (now - lastFired < deviation + interval) {
                    // 浏览器健康状态
                    if (now - timerStart > timeout) {
                        if (!document.hidden) callback && callback()
                        clearInterval(timer)
                    }
                } else {
                    // 不健康,代表浏览器进入后台，则不做操作
                    this.$refs.loading.finish()
                    clearInterval(timer)
                }
                lastFired = now
            }, 200)
            // 如果chrome唤醒app时间较短则不会触发视图窗口可视状态的变化
            // 进入我们apphome页就算唤起成功，只有跳过了广告页面才会改变进程的前后状态
        document.onvisibilitychange = function() {
            clearInterval(timer)
        }
    }
}

/**
 * 用跳转链接的形式尝试唤醒
 * 在部分手机会报错误
 * @param {String} target 链接
 * @param {Function} failback 失败回调
 */
export const invokeByHref = function(target, failback) {
    window.location.href = target
    pageDlay.call(this, failback)
}

/**
 * 用iframe的形式尝试唤醒
 * 是一种废弃的标准，为了解决兼容才存在
 * @param {String} target
 * @param {Function} failback
 */
export const invokeByIframe = function(target, failback) {
    const iframe = document.createElement('iframe')
    iframe.frameborder = '0'
    iframe.style.cssText = 'display:none;border:0;width:0;height:0;'
    document.body.appendChild(iframe)
    iframe.src = target
    pageDlay.call(this, failback)
}

export const callApp = function(page, failback) {
    const utmParam = getUtmParam.call(this)
    this.$sendEvLog(
        Object.assign({
                category: 'callup_app',
                action: 'callup',
                label: location.pathname,
                value: 1
            },
            utmParam.map
        )
    )

    // 该判断需要根据大量测试场景进行判断
    if (browser.browserVer > 40) {
        if (browser.ua.indexOf('UCBrowser') > 0) {
            if (browser.androidVer >= 4.4) {
                invokeByHref.call(this, createScheme(page), failback)
            } else {
                invokeByHref.call(this, createIntent(page), failback)
            }
        } else {
            invokeByHref.call(this, createScheme(page), failback)
        }
    } else {
        invokeByHref.call(this, createIntent(page), failback)
            // invokeByIframe.call(this, createScheme(page), failback)
    }
}

export const downApk = function(callback) {
    const utmParam = getUtmParam.call(this)
    this.$sendEvLog(
        Object.assign({
                category: 'callup_app',
                action: 'down_apk',
                label: location.pathname,
                value: 1
            },
            utmParam.map
        )
    )
    if (browser.isIos) {
        this.$refs.loading.finish()
        window.location.href = appleStore
    } else {
        axios.get('http://upms.startimestv.com/cms/public/app').then(data => {
            this.$refs.loading.finish()
            const url = data.data.apkUrl
            const direct = url.indexOf('google') > 0 ? url.replace('google', 'officialWap') : url
            window.location.href = direct
        })
    }
    callback && callback()
}

export const callMarket = function(failback) {
    const utmParam = getUtmParam.call(this)
    let source = utmParam.str

    // 对组队活动特殊处理teamno
    const activity_id = getQuery('activity') || 1
    const teamno = getQuery('teamno')
    if (teamno) {
        source =
            source +
            encodeURIComponent(
                '&utm_term=' +
                encodeURIComponent(
                    'com.star.mobile.video.activity.BrowserActivity?loadUrl=' +
                    encodeURIComponent(location.origin + `/activity/team/home.html?activity=${activity_id}&teamno=${teamno}`)
                )
            )
    }

    this.$sendEvLog(
        Object.assign({
                category: 'callup_app',
                action: 'to_googleplay',
                label: location.pathname,
                value: 1
            },
            utmParam.map
        )
    )

    if (browser.isIos) {
        this.$refs.loading.finish()
        window.location.href = appleStore
    } else if (browser.ua.indexOf('MuMu') >= 0 || browser.ua.indexOf('I9502') > 0) {
        // android 6+
        this.$refs.loading.finish()
        invokeByIframe.call(this, `market://details?id=com.star.mobile.video${source}`, failback)
    } else {
        this.$refs.loading.finish()
        invokeByHref.call(this, `market://details?id=com.star.mobile.video${source}`, failback)
    }
}

export const playVodinApp = function(appType, vod) {
    if (appType == 1) {
        toNativePage('com.star.mobile.video.player.PlayerVodActivity?vodId=' + vod)
    } else if (appType == 2) {
        window.location.href = 'startimes://player?vodId=' + vod
    } else {
        callApp.call(this, 'com.star.mobile.video.player.PlayerVodActivity?vodId=' + vod, () => {
            callMarket.call(this, () => {
                downApk.call(this)
            })
        })
    }
}

export const toNativePage = function(page) {
    if (page.indexOf('com.star.mobile.video') >= 0) {
        window.getChannelId && window.getChannelId.toAppPage(3, page, '')
    } else {
        window.location.href = page
    }
}

// TODO 5.20 以前 准备废弃
export const shareInvite = (link, shareTitle, shareContent, shareImg) => {
    if (window.getChannelId && window.getChannelId.showCustorm) {
        const content = '【' + shareTitle + '】' + shareContent + ' ' + link
        window.getChannelId.showCustorm(content, link, link, link, link, link, link, shareImg || '', shareTitle)
    }
}

export const shareByFacebook = (link, shareContent) => {
    if (window.getChannelId && window.getChannelId.shareFacebook) {
        window.getChannelId.shareFacebook('', shareContent, link, link, '')
    }
}
export const shareByWhatsApp = (link, shareTitle, shareContent, shareImg) => {
    if (window.getChannelId && window.getChannelId.shareWhatsApp) {
        window.getChannelId.shareWhatsApp(shareTitle + ' ', ' ', link, shareImg, '')
    }
}
export const shareByCopyLink = link => {
    if (window.getChannelId && window.getChannelId.shareCopyLink) {
        window.getChannelId.shareCopyLink(link)
    }
}

export const shareByXender = (teamno, type) => {
    if (window.getChannelId && window.getChannelId.shareXender) {
        window.getChannelId.shareXender(teamno, type)
    }
}

export const getUtmParam = function() {
        const query = location.search
        const referrer = query.referrer
        let source = '&referrer='
        let utmSource = ''
        let utmCampaign = ''
        let utmMedium = ''

        if (query.referrer) {
            // 通过referrer 参数接收
            source = source + referrer
            utmSource = getQuery('utm_source', decodeURIComponent(referrer)) || ''
            utmMedium = getQuery('utm_medium', decodeURIComponent(referrer)) || ''
            utmCampaign = getQuery('utm_campaign', decodeURIComponent(referrer)) || ''
        } else if (query.utm_source) {
            // 通过utm_source格式接收
            let str = `utm_source=${query.utm_source}`
            if (query.utm_medium) str += `&utm_medium=${query.utm_medium}`
            if (query.utm_campaign) str += `&utm_campaign=${query.utm_campaign}`
            source = source + encodeURIComponent(str)
            utmSource = query.utm_source || ''
            utmMedium = query.utm_medium || ''
            utmCampaign = query.utm_campaign || ''
        } else if (query.utms) {
            // 通过utms简写方式(utms,utmm,utmc)
            let str = `utm_source=${query.utms}`
            if (query.utmm) str += `&utm_medium=${query.utmm}`
            if (query.utmc) str += `&utm_campaign=${query.utmc}`
            source = source + encodeURIComponent(str)
            utmSource = query.utms || ''
            utmMedium = query.utmm || ''
            utmCampaign = query.utmc || ''
        } else {
            // 通过会话缓存接收
            const utmCache = sessionStorage.getItem('utm_str')
            if (utmCache) {
                source = source + utmCache
                utmSource = getQuery('utm_source', decodeURIComponent(utmCache)) || ''
                utmMedium = getQuery('utm_medium', decodeURIComponent(utmCache)) || ''
                utmCampaign = getQuery('utm_campaign', decodeURIComponent(utmCache)) || ''
            } else {
                source = source + encodeURIComponent('utm_source=officeWap')
                utmSource = 'officeWap'
                utmMedium = 'officeWap'
                utmCampaign = 'officeWap'
            }
        }
        return {
            str: source,
            map: {
                utm_source: utmSource,
                utm_medium: utmMedium,
                utm_campaign: utmCampaign
            }
        }
    }
    /**
     *
     * @param {string} key 获取query参数名
     * @param {string} queryStr 指定字符串
     */
export const getQuery = function(key, queryStr) {
    let query = queryStr || location.search
    query = query.includes('?') ? query.replace('?', '') : query
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=')
        if (decodeURIComponent(pair[0]) == key) {
            if (pair[1]) {
                return decodeURIComponent(pair[1])
            } else {
                return ''
            }
        }
    }
}

export const addTicketByDownload = function(vote_id) {
    const user = getQuery('pin')
    const lastGetTicket = getCookie('get_ticket_time')
    if (user && !lastGetTicket) {
        let url = '/hybrid/api/sign'
        if (env.apiUrl == 'http://upms.startimestv.com') {
            url = 'http://m.startimestv.com' + url
        }
        this.$axios.get(url).then(({ data }) => {
            if (data.code == 200) {
                this.$axios({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        token: this.$token,
                        'X-Secret': data.data
                    },
                    data: qs.stringify({
                        vote_id: vote_id,
                        target: user,
                        action: 'SHARE_DOWNLOAD'
                    }),
                    url: '/voting/v1/ticket'
                }).then(() => {
                    setCookie('get_ticket_time', 1, 1000 * 60 * 60 * 24 * 30)
                })
            }
        })
    }
}

/**
 *
 * @param {string} link 分享链接,默认是当前地址
 * @param {string} quote  由开发者定义的引文，可由用户编辑  default null
 * @param {string} hashtag  由开发者定义的话题标签 default null
 * @param {string} redirect_uri  分享后的跳转地址，默认是当前页面
 */
export const shareByFacebookInWeb = (link, quote, hashtag, redirect_uri) => {
    link = link || location.href
    redirect_uri = redirect_uri || location.href
    let href =
        'https://www.facebook.com/dialog/share?app_id=' +
        env.facebookAppId +
        '&display=popup&href=' +
        encodeURIComponent(link) +
        '&redirect_uri=' +
        encodeURIComponent(redirect_uri)

    if (quote) href += '&quote=' + encodeURIComponent(quote)
    if (hashtag) href += '&hashtag=' + encodeURIComponent(hashtag)

    window.location.href = href
}
export const shareByTwitterInWeb = function(text, link) {
    window.location.href = 'http://twitter.com/share?url=' + encodeURIComponent(link) + '&text=' + encodeURIComponent(text)
}

export const copyClipboard = function(text) {
    const input = document.createElement('input')
    input.setAttribute('readOnly', true)
    document.body.appendChild(input)
    input.setAttribute('value', text)
    input.select()
    const successful = document.execCommand('copy')
    document.body.removeChild(input)
    window.getSelection().removeAllRanges()

    if (successful) {
        alert('Copied')
    } else {
        alert('Copy text is not support on your browser')
    }
}

export const toNativeLogin = function(type) {
    if (type == 2) {
        toNativePage('startimes://login')
    } else {
        toNativePage('com.star.mobile.video.account.LoginActivity')
    }
}