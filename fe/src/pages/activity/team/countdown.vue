<template>
  <div class="remaining box1" v-if="activityStart>0">
    <img v-if="lang=='fr'" src="@/assets/img/vote/TeamFission/prize-fr.png" @click="toAwards" />
    <img v-if="lang=='pt'" src="@/assets/img/vote/TeamFission/prize-pt.png" @click="toAwards" />
    <img v-if="lang=='sw'" src="@/assets/img/vote/TeamFission/prize-sw.png" @click="toAwards" />
    <img v-if="lang!='fr'&&lang!='pt'&&lang!='sw'" src="@/assets/img/vote/TeamFission/prize-en.png" @click="toAwards" />
    <div class="title">{{$t('vote.team.countdownTitle')}}</div>
    <div class="contant">
      <div class="day">
        <span>{{days | formatAmount}}</span> days VIP
      </div>
      <div class="day count-down">
        <div>
          <span>{{hour}}</span> h
        </div>
        <div class="line-vertical"></div>
        <div>
          <span>{{min}}</span> m
        </div>
        <div class="line-vertical"></div>
        <div>
          <span>{{sed}}</span> s
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { toNativePage, getQuery } from '@/functions/app'
import { formatAmount } from '@/functions/utils'
export default {
  props: {
    activityStart: {
      required: true,
      type: Number
    },
    activityEnd: {
      required: true,
      type: Number
    },
    teamNo: {
      required: false
    },
    isFull: {
      required: false,
      type: Boolean
    }
  },
  watch: {
    activityStart(nv, ov) {
      if (nv) {
        this.init()
      } else {
        if (ov > 0) {
          this.init()
        }
      }
    }
  },
  data() {
    return {
      activity_id: getQuery('activity') || 1,
      days: '1000000',
      hour: '',
      min: '',
      sed: '',
      lang: this.$lang
    }
  },
  filters: {
    formatAmount(val) {
      return formatAmount(val)
    }
  },
  methods: {
    init() {
      const during = this.activityEnd - this.activityStart
      const stage1 = Math.round(during * 0.25)
      const stage2 = Math.round(during * 0.5)
      const stage3 = Math.round(during * 0.75)
      const px1 = 0.7
      const px2 = 0.85
      const px3 = 0.95

      // 计算减小倍率
      const speed = Math.floor(((100 * 10000) / during) * 1000 * 100) / 100
      // 计算活动开始的时间
      const period = Math.floor((this.$serverTime - this.activityStart) / 1000)

      if (period < stage1) {
        this.days = 100 * 10000 - Math.ceil(period * speed * px1)
      } else if ((period < stage2) & (period > stage1)) {
        this.days = 100 * 10000 - Math.ceil((period - stage1) * speed * px2) + stage1 * speed * px1
      } else if ((period < stage3) & (period > stage2)) {
        this.days = 100 * 10000 - Math.ceil((period - stage2) * speed * px3) + stage2 * speed * px2 + stage1 * speed * px1
      } else {
        this.days = 100 * 10000 - Math.ceil((period - stage3) * speed * 1.2) + stage3 * speed * px3 + stage2 * speed * px2 + stage1 * speed * px1
      }

      // 倒计时
      let page_init_time = new Date().getTime()
      let last_client_time = page_init_time
      let serverTime = parseInt(this.$serverTime)

      setInterval(() => {
        const now_time = new Date().getTime()

        if (now_time - last_client_time < 1000 * 60) {
          serverTime = serverTime + (now_time - last_client_time)
        } else {
          page_init_time = now_time
          serverTime = this.$serverTime + now_time - page_init_time
        }
        last_client_time = now_time

        const remainTime = Math.floor((this.activityEnd - serverTime) / 1000)

        const hour = Math.floor(remainTime / 60 / 60)
        const min = Math.floor((remainTime - hour * 60 * 60) / 60)
        const sed = remainTime - hour * 60 * 60 - min * 60

        this.hour = hour > 0 ? hour : '00'
        this.min = min < 10 ? '0' + min : min
        this.sed = sed < 10 ? '0' + sed : sed
      }, 300)
    },
    mSendEvLog(action, label, value) {
      this.$sendEvLog({
        category: 'referral_team_' + this.$platform,
        action: action,
        label: label,
        value: value
      })
    },
    toAwards() {
      if (this.$isLogin) {
        this.mSendEvLog('myprize_click', '', '1')
        if (this.isFull) {
          sessionStorage.setItem('search_full_team', 1)
        }
        window.location.href = `/activity/team/awards.html?activity=${this.activity_id}&teamno=${this.teamNo}`
      } else {
        this.mSendEvLog('myprize_click', '', '0')
        toNativePage('com.star.mobile.video.account.LoginActivity')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.box1 {
  position: relative;
  z-index: 2;
  width: 95%;
  margin: 0 auto;
  font-style: italic;
  .title {
    font-style: normal;
    background-image: linear-gradient(rgba(189, 4, 78, 0.5), rgba(165, 3, 80, 0.5));
    width: 80%;
    height: 2rem;
    color: #ffbc00;
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
    padding-left: 0.8rem;
    line-height: 2rem;
    font-size: 0.9rem;
  }
  .contant {
    padding: 0.5rem;
    background-image: linear-gradient(rgba(165, 3, 80, 0.5), #600165);
    border-radius: 1rem;
    border-top-left-radius: 0;
    color: #fff;
  }
}
.remaining {
  margin: -14% auto 0.5rem;
  > img {
    position: absolute;
    width: 20%;
    top: -2.5rem;
    right: -0.5rem;
  }
  .contant {
    .day {
      width: 100%;
      height: 2.5rem;
      line-height: 2.5rem;
      background-image: url('~@/assets/img/vote/TeamFission/bg-remain.png');
      background-size: 100% 2.5rem;
      text-align: center;
      font-size: 1.2rem;
      color: #8a80a0;
      span {
        font-size: 1.3rem;
        font-weight: bold;
        letter-spacing: 0.15rem;
        color: #8a80a0;
      }
      &:first-child {
        margin-bottom: 0.5rem;
      }
      div {
        display: inline-block;
      }
    }
    .count-down {
      display: flex;
      div {
        flex: 1;
      }
      .line-vertical {
        max-width: 1px;
        background: url('~@/assets/img/vote/TeamFission/verline.png') no-repeat center center;
      }
    }
  }
}
</style>
