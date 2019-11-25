<template>
  <div class="wrapper">
    <img src="@/assets/img/vote/TeamFission/landing-banner.png" class="banner" />
    <div class="download">
      <div v-if="appType==2" class="download-appstore-wrapper" @click="down()">
        <img v-if="lang=='fr'" src="@/assets/img/landpage/ios_appstore_bg_fy.png" />
        <img v-if="lang=='pt'" src="@/assets/img/landpage/ios_appstore_bg_py.png" />
        <img v-if="lang!='pt'&&lang!='fr'" src="@/assets/img/landpage/ios_appstore_bg.png" />
      </div>
      <div v-if="appType==1" class="download-app-wrapper">
        <div class="download-app-btn" @click="down()">
          <div style="padding:0px 0.8rem">{{$t('vote.team.download_apk')}}</div>
        </div>
      </div>
    </div>
    <img src="@/assets/img/vote/TeamFission/ic_startimeson.png" class="icon" />
  </div>
</template>
<script>
import { downApk, callApp, callMarket, getQuery } from '@/functions/app'
import { getBrowser, getCookie } from '@/functions/utils'
export default {
  components: {},
  data() {
    return {
      activity_id: getQuery('activity') || 1,
      appType: 0,
      lang: 'en'
    }
  },
  mounted() {
    this.appType = getBrowser().isIos ? 2 : 1
    this.lang = getCookie('lang') || 'en'
  },
  methods: {
    mSendEvLog(action, label, value) {
      this.$sendEvLog({
        category: 'referral_team_' + this.$platform,
        action: action,
        label: label,
        value: value
      })
    },
    down() {
      this.mSendEvLog('callApp', 'landingpage', '1')
      callApp.call(
        this,
        `com.star.mobile.video.activity.BrowserActivity?loadUrl=${window.location.origin}/activity/team/home.html?activity=${this.activity_id}`,
        () => {
          callMarket.call(this, () => {
            downApk.call(this)
          })
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/vote/normal.less';
.wrapper {
  background-image: linear-gradient(#a70720, #710045);
  height: 100%;
  position: fixed;
  .banner {
    width: 100%;
  }
  .icon {
    width: 45%;
    position: absolute;
    bottom: 5%;
    left: 27.5%;
  }
  .download {
    width: 65%;
    position: absolute;
    bottom: 15%;
    left: 17.5%;
    .download-app-btn {
      font-size: 1.2rem;
      line-height: 3rem;
      height: 3rem;
      text-align: center;
      color: rgba(255, 255, 255, 1);
      background-color: #231f20;
      border-radius: 0.3rem;
    }
    .download-appstore-wrapper {
      width: 85%;
      min-height: 44px;
      overflow: hidden;
      text-align: center;
      margin: 0 auto;
      img {
        width: 100%;
        min-height: 44px;
      }
    }
  }
}
</style>
