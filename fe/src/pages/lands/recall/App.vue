<template>
  <div class="wrapper">
    <div class="contain">
      <img src="@/assets/img/landpage/word.png" class="word" alt="StarTimes APP" />
      <div class="down">
        <div v-show="appType == 1" @click="down()">Download Now</div>
        <img v-show="appType == 2" src="@/assets/img/landpage/button-appstore.png" alt="StarTimes APP" @click="down()" />
      </div>
    </div>
    <confirm-dialog ref="confirm" />
    <loading ref="loading" />
  </div>
</template>
<script>
import { downApk, callApp, callMarket, getUtmParam, callAppleStore } from '@/functions/app'
import { getBrowser } from '@/functions/utils'
import confirmDialog from '@/components/confirm'
import loading from '@/components/loading'
export default {
  layout: 'base',
  components: {
    confirmDialog,
    loading
  },
  data() {
    return {
      appType: null
    }
  },
  mounted() {
    const browser = getBrowser()
    this.appType = browser.isIos ? 2 : 1
    const utmParm = getUtmParam.call(this)
    this.$sendEvLog(
      Object.assign(
        {
          category: 'recall_ng',
          action: 'page_show',
          label: window.location.pathname,
          value: 1
        },
        utmParm.map
      )
    )
  },
  methods: {
    down() {
      this.$refs.loading.start()
      this.$sendEvLog({
        category: 'recall_ng',
        action: 'btn_tap',
        label: this.appType == 2 ? 'appstore' : 'googleplay',
        value: 1
      })
      if (this.appType == 2) {
        callAppleStore.call(this)
      } else {
        callApp.call(this, '', () => {
          callMarket.call(this, () => {
            this.$refs.loading.finish()
            this.$refs.confirm.show(
              'Download apk now?（12M）',
              () => {
                downApk.call(this)
              },
              () => {},
              'OK',
              'NOT NOW'
            )
          })
        })
      }
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
  min-height: 660px;
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
      width: 65%;
    }
    div {
      width: 65%;
      margin: 0 auto;
      background: #000;
      color: #fff;
      height: 3.5rem;
      line-height: 3.5rem;
      font-size: 1.4rem;
      border-radius: 4px;
    }
  }
}
</style>
