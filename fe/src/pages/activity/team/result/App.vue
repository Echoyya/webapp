<template>
  <div class="wrapper">
    <mBanner />
    <countdown @toAwards="toAwards" :activityStart="activityStart" :activityEnd="activityEnd" />
    <div class="prize">
      <div class="text">{{text[prize-1]}}</div>
      <div class="vip">VIP {{award_day}} DAY</div>
    </div>
    <div class="share-box">
      <img src="@/assets/img/vote/TeamFission/ic_voice.png" />
      <div class="text">SHOW MY LUCKY</div>
      <img src="@/assets/img/vote/TeamFission/ic-facebook.png" @click="toFacebook" />
      <img src="@/assets/img/vote/TeamFission/ic_WhatsApp.png" @click="toWhatsApp" />
      <img src="@/assets/img/vote/TeamFission/ic_xender.png" @click="toXender" />
      <img src="@/assets/img/vote/TeamFission/ic_download.png" @click="toDownload" />
      <img src="@/assets/img/vote/TeamFission/ic-copylink.png" @click="toCopylink" />
    </div>
    <div class="team-btn">
      <div @click="create">FORM A NEW TEAM</div>
    </div>
    <div class="tip">
      <div class="text">
        Tips:
        <br />VIP will be effective from time 123, a total of nine days, the number of times you have won the lottery will automatically add up.
      </div>
    </div>
    <mShare ref="share" />
    <toast-dialog ref="toast" />
    <malert ref="malert" />
    <malert ref="findTeamAlert">
      <a slot="link" href="/activity/team/search.html">CHANGE</a>
    </malert>
  </div>
</template>
<script>
import { formatAmount } from '@/functions/utils'
import toastDialog from '@/components/toast'
import mShare from '@/components/web/share.vue'
import mBanner from '@/pages/activity/team/banner.vue'
import { shareByFacebook, shareByWhatsApp, shareByXender, shareByDownload, shareByCopyLink, getQueryVariable } from '@/functions/app'
import malert from '@/pages/activity/team/malert'
import countdown from '@/pages/activity/team/countdown'
export default {
  components: {
    mBanner,
    mShare,
    toastDialog,
    malert,
    countdown
  },
  data() {
    return {
      // 页面
      imgUrl: 'http://cdn.startimestv.com/banner/BSSVote2-banner.png',
      shareTitle: 'Bongo Star Search 2019',
      shareText: 'Saidia mshiriki wako unayempenda kurudi kwenye show!',
      prize: 1,
      text: ['好运降临，获得VIP啦！', '	这一周的精彩内容不要错过！', '哇！简直天降好运！'],
      award_day: '',

      activityStart: new Date('2019-11-05 00:00:00').getTime(),
      activityEnd: new Date('2019-11-18 04:00:00').getTime(),
      // remaining
      days: '1000000',
      hour: '',
      min: '',
      sed: ''
    }
  },
  filters: {
    formatAmount(val) {
      return formatAmount(val)
    }
  },
  computed: {
    platform() {
      if (this.appType == 1) {
        return 'Android'
      } else if (this.appType == 2) {
        return 'iOS'
      } else {
        return 'web'
      }
    }
  },
  created() {
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
  mounted() {
    this.teamNum = getQueryVariable(location.search.replace('?', ''), 'teamno')
    this.award_day = getQueryVariable(location.search.replace('?', ''), 'prize')
    if (this.award_day == 1) this.prize = 1
    else if (this.award_day == 7) this.prize = 2
    else if (this.award_day == 30) this.prize = 3
  },
  methods: {
    create() {
      window.location.href = '/activity/team/home'
    },
    toFacebook() {
      if (this.appType == 1) {
        shareByFacebook('http://www.baidu.com', this.shareTitle, this.shareText, this.imgUrl)
      }
    },
    toWhatsApp() {
      if (this.appType == 1) {
        shareByWhatsApp('http://www.baidu.com', this.shareTitle, this.shareText, this.imgUrl)
      }
    },
    toXender() {
      if (this.appType == 1) {
        shareByXender(this.teamNum)
      }
    },
    toDownload() {
      if (this.appType == 1) {
        shareByDownload()
      }
    },
    toCopylink() {
      if (this.appType == 1) {
        const bool = shareByCopyLink('https://www.taobao.com/')
        this.$refs.alert.show(bool)
      }
    },
    showAwards() {
      console.log('my awards')
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/vote/normal.less';
.wrapper {
  img,
  div,
  li {
    box-sizing: border-box;
  }
  width: 100%;
  font-size: 0.9rem;
  letter-spacing: -0.03rem;
  position: static;
  background-image: linear-gradient(#7c003d, #6c0049);
  .box {
    position: relative;
    z-index: 2;
    width: 95%;
    margin: 0 auto;
    font-style: italic;
    .title {
      background-image: linear-gradient(rgba(189, 4, 78, 0.5), rgba(165, 3, 80, 0.5));
      width: 80%;
      height: 2rem;
      color: #ffbc00;
      border-top-right-radius: 1rem;
      border-top-left-radius: 1rem;
      padding-left: 0.8rem;
      line-height: 2rem;
    }
    .contant {
      padding: 0.5rem;
      background-image: linear-gradient(rgba(165, 3, 80, 0.5), #600165);
      border-radius: 1rem;
      border-top-left-radius: 0;
      color: #fff;
    }
  }
  .prize {
    width: 95%;
    margin: 0 auto;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 1rem 0.5rem 1.5rem;
    border-radius: 1rem;
    text-align: center;
    .text {
      color: #fff;
      width: 100%;
      margin: 0 auto;
      height: 2rem;
      line-height: 2rem;
      margin-bottom: 1rem;
    }
    .vip {
      color: #ffbc00;
      margin: 0 auto;
      width: 50%;
      height: 3rem;
      line-height: 2.9rem;
      font-size: 1.2rem;
      font-weight: bold;
      border: 0.05rem solid #ffbc00;
      border-radius: 0.5rem;
      background-color: #000;
    }
  }
  .share-box {
    width: 95%;
    margin: 0.5rem auto;
    padding: 0.5rem;
    background-color: #a1014b;
    height: 10rem;
    border-radius: 1rem;
    position: relative;
    > img {
      width: 20%;
      &:nth-child(1) {
        width: 2rem;
        height: 2rem;
        position: absolute;
        left: 5%;
        top: 0.5rem;
      }
    }
    > div {
      width: 100%;
      height: 2rem;
      line-height: 2rem;
      margin: 0 auto;
      color: #fff;
      padding-left: 15%;
      margin-bottom: 1rem;
    }
  }
  .team-btn {
    width: 85%;
    margin: 0.5rem auto;
    text-align: center;
    span {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
    }
    div {
      background: linear-gradient(180deg, rgba(253, 94, 0, 1) 0%, rgba(250, 0, 67, 1) 100%);
      border-radius: 25px;
      border: 0.25rem solid rgba(26, 1, 96, 0.75);
      color: #ffffff;
      height: 2.75rem;
      line-height: 2.25rem;
      margin-top: 0.5rem;
    }
  }
  .tip {
    width: 100%;
    padding-bottom: 1rem;
    .text {
      background-color: rgba(0, 0, 0, 0.5);
      margin: 1rem auto 0;
      border-radius: 1rem;
      width: 95%;
      padding: 1rem;
      color: #fff;
    }
  }
}
</style>
