<template>
  <div class="wrapper">
    <div class="contain">
      <img src="@/assets/img/landpage/word.png" class="word" alt="StarTimes APP" />
      <div class="down">
        <img src="@/assets/img/landpage/button-appstore.png" class="fl" alt="StarTimes APP" @click="down()" />
        <img src="@/assets/img/landpage/button-google.png" class="fr" alt="StarTimes APP" @click="down()" />
      </div>
    </div>
    <confirm-dialog ref="confirm" />
  </div>
</template>
<script>
import { downApk, callApp, callMarket, getUtmParam } from '@/functions/app'
import { getBrowser } from '@/functions/utils'
import confirmDialog from '@/components/confirm'
export default {
  layout: 'base',
  components: {
    confirmDialog
  },
  mounted() {
    const browser = getBrowser()
    this.appType = browser.isIos ? 2 : 1
    const utmParm = getUtmParam.call(this)
    this.$sendEvLog(
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
      callApp.call(this, '', () => {
        callMarket.call(this, () => {
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
