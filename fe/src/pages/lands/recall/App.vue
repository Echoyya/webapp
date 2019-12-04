<template>
  <div class="wrapper">
    <div class="contain">
      <img src="@/assets/img/landpage/word.png" class="word" alt="StarTimes APP" />
      <div class="down">
        <img src="@/assets/img/landpage/button-appstore.png" class="fl" alt="StarTimes APP" @click="down()" />
        <img src="@/assets/img/landpage/button-google.png" class="fr" alt="StarTimes APP" @click="down()" />
      </div>
    </div>
  </div>
</template>
<script>
import { downApk, callApp, callMarket, getUtmParam } from '@/functions/app'
import { getBrowser } from '@/functions/utils'
import { sendEvLog } from '@/functions/analysis.js'

export default {
  layout: 'base',
  mounted() {
    const browser = getBrowser()
    this.appType = browser.isIos ? 2 : 1
    const utmParm = getUtmParam.call(this)
    sendEvLog(
      Object.assign(
        {
          category: 'callup_app',
          action: 'landing_show',
          label: window.location.pathname,
          value: 1
        },
        utmParm.map
      )
    )
    this.down()
  },
  methods: {
    down() {
      this.$nuxt.$loading.start()
      callApp.call(this, '', () => {
        callMarket.call(this, () => {
          downApk.call(this)
          this.$nuxt.$loading.finish()
        })
      })
    }
  },
  head() {
    return {
      title: 'StarTimes ON APP',
      meta: [
        { name: 'description', property: 'description', content: 'StarTimes | Movies | Sport | Series | Music | TV Guide | Entertainment' },
        {
          name: 'og:description',
          property: 'og:description',
          content: 'StarTimes | Movies | Sport | Series | Music | TV Guide | Entertainment'
        },
        {
          name: 'og:image',
          property: 'og:image',
          content: 'http://m.startimestv.com/_nuxt/img/6672906.png'
        },
        { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
        { name: 'og:title', property: 'og:title', content: 'StarTimes APP' },
        {
          name: 'al:android:url',
          property: 'al:android:url',
          content: 'starvideo://platformapi/webtoapp?channel=facebook'
        },
        { name: 'al:android:app_name', property: 'al:android:app_name', content: 'StarTimes' },
        { name: 'al:android:package', property: 'al:android:package', content: 'com.star.mobile.video' },
        { name: 'al:web:url', property: 'al:web:url', content: 'http://m.startimestv.com' }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  background: url('~@/assets/img/landpage/recall.jpg') no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100vh;
  .contain {
    position: absolute;
    bottom: 1.5rem;
    width: 100%;
    .word {
      width: 100%;
      margin-bottom: 1rem;
    }
  }
  .down {
    width: 92%;
    margin: 0 auto;
    text-align: center;
    img {
      width: 45%;
      &.fr {
        float: right;
      }
      &.fl {
        float: left;
      }
    }
  }
}
</style>
