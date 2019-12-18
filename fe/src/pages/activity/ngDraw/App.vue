<template>
  <div class="wrapper">
    <div class="container">
      <div class="top">
        <img src="@/assets/img/vote/ngDraw/img-banner.png" alt="bg-img" class="bg-img" />
        <div class="tab-box">
          <img src="@/assets/img/vote/ngDraw/ic-rules.png" @click="showRule" />
          <img src="@/assets/img/vote/ngDraw/ic-prize.png" @click="showAward" />
        </div>
      </div>
      <div class="page-vote">
        <img v-if="appType!==0" src="@/assets/img/vote/ngDraw/ic-share.png" class="share" @click="toShare('home')" />
        <img v-else src="@/assets/img/vote/ngDraw/ic-callapp.png" class="share" @click="callOrDownApp('download now')" />
        <div class="lottery-type">
          <div class="count">CHANCES REMAINING:{{ appType > 0 ? lotteryLeft : 0 }}</div>
          <lottery
            ref="lottery"
            :id="lottery_id"
            :defaultPrizeIndex="4"
            :withMsgList="showMsg"
            :btnGray="lotteryBtnGray"
            :btnText="'WIN'"
            :hasGotText="'has won'"
            @drawClick="startDraw"
            @end="endLottery"
            @getItemsError="lotteryError"
            @getResultError="lotteryError"
          ></lottery>
          <div class="tip">
            <p>FIND THE GIFT IN [MY PRIZE]</p>
          </div>
        </div>
      </div>
      <img v-if="clipsList.length>0" class="text text4" src="@/assets/img/vote/ngDraw/text4.png" alt />
      <div v-if="clipsList.length>0" class="past-programme">
        <ul class="clearfix">
          <li v-for="(item, i) in clipsList" :key="i">
            <div @click="toPlayer(item)">
              <img class="url" :src="item.cover + '?w=230'" />
            </div>
            <p class="title">{{ item.description }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div v-show="show_rules" class="rules-box">
      <img src="@/assets/img/vote/ngDraw/bg-rules.png" alt />
      <div class="rule-text">
        <div>
          <p>Are you a lover of comedy and a good laugh? Then Alibaba's January 1st Concert  is just what you need; to get a chance to win a ticket to attend the show come 1st of January, 2020.</p>
          <p>The King of comedy is set to host Lagos with music, comedy and celebration. Each ticket costs ₦ 6000!</p>
          <p>1. From Dec 20th to 27th you have 1 chance to win a free ticket each day.</p>
          <p>2. Share the link to invite your friends to download StarTimes ON APP to get more chances. Each new user you invite will get you 1 more chance to win. The more you invite, the more chances you can get.</p>
          <p>3. You can also following our social media page @startimesng to get more informations.</p>
          <p>4. Ticket collection: Take the prize information at the appointed StarTimes Business Hall or the Performance Site.</p>
          <p>5. Time: January 1, 2020 @ 6:00 pm - 11:30 pm</p>
          <p>6. Venue: Eko Hotel Convention Centre, Victoria Island, Lagos.</p>
        </div>
      </div>
      <img src="@/assets/img/vote/BSSRegister/ic-close.png" alt @click="closeShadow" />
    </div>
    <div v-show="show_awards" class="awards-box">
      <img src="@/assets/img/vote/ngDraw/bg-prize.png" alt />
      <div class="award-item">
        <ul v-if="awardsList.length>0">
          <li v-for="(item, i) in awardsList" :key="i">
            <img :src="item.reward_picture_url" alt />
            <span>{{item.reward_name}}</span>
            <span>{{item.created_time.substr(0,10)}}</span>
          </li>
        </ul>
      </div>
      <img src="@/assets/img/vote/BSSRegister/ic-close.png" alt @click="closeShadow" />
    </div>
    <div v-show="show_rules||show_awards" class="shadow-box" @click="closeShadow"></div>
    <mShare v-if="$appType == 0" ref="share" />
    <alert-dialog ref="alert" />
    <confirm-dialog ref="confirm" />
    <toast-dialog ref="toast" />
    <loading ref="loading" />
  </div>
</template>
<script>
import qs from 'qs'
import alertDialog from '@/components/alert'
import confirmDialog from '@/components/confirm'
import toastDialog from '@/components/toast'
import mShare from '@/components/web/share.vue'
import loading from '@/components/loading'
import lottery from '@/components/lotteryFull'
import BScroll from 'better-scroll'
import { callApp, downApk, playVodinApp, shareInvite, shareInviteIos, addTicketByDownload, getQuery, callAppleStore } from '@/functions/app'
import { getBrowser } from '@/functions/utils'
export default {
  components: {
    mShare,
    alertDialog,
    confirmDialog,
    toastDialog,
    loading,
    lottery
  },
  data() {
    return {
      // 页面
      vote_id: getQuery('voteid') || 74,
      lottery_id: this.$appType == 2 ? 9 : 8,
      startTime: '',
      endTime: '',

      imgUrl: 'http://cdn.startimestv.com/banner/BSSVote3-banner.png',
      shareTitle: 'StarTimes Giveaway',
      shareText: "Come on, I'm drawing the Alibaba's Jan 1st Concert Ticket Free, Join with me!",
      show_rules: false,
      show_awards: false,
      appType: this.$appType,
      isLogin: this.$isLogin,

      scrollWrapper: null,
      scrollPop: null,

      showMsg: true,
      clipsList: [],
      awardsList: [],

      // 抽奖
      voteLeft: 0,
      click: true,
      lotteryLeft: 0
    }
  },
  computed: {
    lotteryBtnGray() {
      return this.appType > 0 && this.lotteryLeft <= 0
    }
  },
  mounted() {
    this.mSendEvLog('homepage_show', '', '1')
    if (getQuery('utm_source')) {
      this.mSendEvLog('re_user', '', '1')
    }
    this.getLotteryInfo()
    const browser = getBrowser()
    // 解决scroll卡顿在789系统
    if (browser.isAndroid && browser.androidVer >= 6) {
      this.$nextTick(() => {
        document.documentElement.style.height = '100%'
        document.body.style.height = '100%'
        document.querySelector('.wrapper').style.height = '100%'
        document.querySelector('.wrapper').style.overflow = 'hidden'
        this.scrollWrapper = new BScroll('.wrapper', {
          scrollY: true,
          click: true,
          bounce: false
        })
      })
    }
  },
  methods: {
    getLotteryInfo() {
      this.$axios
        .get(`/voting/lottery/v1/info?lottery_id=${this.lottery_id}`)
        .then(res => {
          if (res.data.code == 0) {
            this.startTime = new Date(res.data.data.start_time.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime()
            this.endTime = new Date(res.data.data.end_time.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime()
            if (this.$serverTime < this.startTime) {
              this.showMsg = false
            }
            this.getVoteRemain()
            this.getVideoMsg()
          } else {
            this.$refs.alert.show('Get Lottery Info Error! ' + res.data.message)
          }
        })
        .catch(err => {
          this.$refs.alert.show('Get Lottery Info Error!! ' + err)
        })
    },
    lotteryError(err) {
      this.$refs.alert.show(err.errMsg)
    },
    startDraw() {
      if (!this.click) {
        return
      }
      if (this.appType == 0 || this.$serverTime < this.startTime || this.$serverTime >= this.endTime || this.lotteryLeft <= 0) {
        this.mSendEvLog('winbtn_click', '', '0')
      }
      if (this.appType == 0) {
        this.callOrDownApp('win')
        return
      }
      if (this.$serverTime < this.startTime) {
        this.$refs.alert.show('活动未开始', () => {}, 'GOT IT')
        return
      }
      if (this.$serverTime >= this.endTime) {
        this.$refs.alert.show('活动已结束', () => {}, 'GOT IT')
        return
      }
      if (this.lotteryLeft <= 0) {
        // 票不够不能抽奖
        this.$refs.alert.show(
          'Dear, you have no chance today, SHARE for more chances!',
          () => {
            this.toShare('nochance')
          },
          'SHARE NOW'
        )
        return
      }
      this.click = false
      this.lotteryLeft--
      this.mSendEvLog('winbtn_click', '', '1')
      this.$refs.lottery.tween()
    },
    endLottery(prize) {
      if (prize.prizeIndex == 0) {
        setTimeout(() => {
          this.$refs.alert.show(
            "You've got Alibaba's Jan 1st Concert Ticket!",
            () => {
              this.toShare('ticket')
              this.click = true
            },
            'Share the joy with friends'
          )
        }, 1000)
      } else if (prize.prizeIndex == 1) {
        setTimeout(() => {
          this.$refs.alert.show(
            "You've got Monthly MAX VIP!",
            () => {
              this.toShare('30dayvip')
              this.click = true
            },
            'Share the joy with friends'
          )
        }, 1000)
      }else if (prize.prizeIndex == 7) {
        setTimeout(() => {
          this.$refs.alert.show(
            "You've got Weekly MAX VIP!",
            () => {
              this.toShare('7dayvip')
              this.click = true
            },
            'Share the joy with friends'
          )
        }, 1000)
      }else if (prize.prizeIndex == 3 || prize.prizeIndex == 5) {
        setTimeout(() => {
          this.$refs.alert.show(
            "You've got 1 DAY MAX VIP!",
            () => {
              this.toShare('ticket')
              this.click = true
            },
            'Share the joy with friends'
          )
        }, 1000)
      } else if (prize.prizeIndex === 6) {
        setTimeout(() => {
          this.lotteryLeft++
          this.$refs.alert.show(
            "Congrats! You've got 1 more chance!",
            () => {
              this.toShare('chance')
              this.click = true
            },
            'Share the joy with friends'
          )
        }, 1000)
      } else if (prize.prizeIndex === 4) {
        setTimeout(() => {
          this.$refs.alert.show(
            'Thanks for your participation. Share for more chances!',
            () => {
              this.toShare('thanks')
              this.click = true
            },
            'SHARE'
          )
        }, 1000)
      }
    },
    showRule() {
      this.mSendEvLog('rulesbtn_click', '', '1')
      this.show_rules = true
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.left = '0'
      document.body.style.right = '0'
      this.$nextTick(() => {
        if (this.scrollWrapper) {
          this.scrollWrapper.disable()
          this.scrollPop = new BScroll('.rule-text', {
            scrollY: true,
            click: true,
            bounce: false
          })
        }
      })
    },
    showAward() {
      this.mSendEvLog('myprize_click', '', '1')
      this.getAwardsList()
      this.show_awards = true
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.left = '0'
      document.body.style.right = '0'
      this.$nextTick(() => {
        if (this.scrollWrapper) {
          this.scrollWrapper.disable()
          this.scrollPop = new BScroll('.award-item', {
            scrollY: true,
            click: true,
            bounce: false
          })
        }
      })
    },
    // 埋点方法
    mSendEvLog(action, label, value) {
      this.$sendEvLog({
        category: 'vote_comedyshow_' + this.$platform,
        action: action,
        label: label,
        value: value
      })
    },
    // 调出分享弹层(app/web)
    toShare(label) {
      this.mSendEvLog('share_click', label, '1')
      const url =
        window.location.href.indexOf('?') >= 0
          ? window.location.href +
            (this.isLogin ? '&pin=' + this.$user.id : '') +
            '&utm_source=startimes_app&utm_medium=comedyshow&utm_campaign=' +
            this.$platform
          : window.location.href +
            (this.isLogin ? '?pin=' + this.$user.id : '') +
            '&utm_source=startimes_app&utm_medium=comedyshow&utm_campaign=' +
            this.$platform
      if (this.appType == 1) {
        shareInvite(url, this.shareTitle, this.shareText, this.imgUrl)
      } else if (this.appType == 0) {
        this.$refs.share.show()
      } else {
        shareInviteIos.call(this, url, this.shareTitle, this.shareText, this.imgUrl)
      }
    },
    // 唤醒转入活动页或下载App
    callOrDownApp(label) {
      const browser = getBrowser()
      if (browser.isIos) {
        this.mSendEvLog('downloadpopup_show', label, '1')
        this.$refs.confirm.show(
          'Start downloading apk now? (12M)',
          () => {
            this.mSendEvLog('downloadpopup_clickok', label, '1')
            addTicketByDownload.call(this, this.vote_id, () => {
              this.mSendEvLog('callApp', label, '1')
              callAppleStore.call(this)
            })
          },
          () => {
            this.mSendEvLog('downloadpopup_clicknot', label, '1')
          },
          'OK',
          'NOT NOW'
        )
      } else {
        this.$refs.loading.start()
        this.mSendEvLog('callApp', label, '1')
        callApp.call(this, 'com.star.mobile.video.activity.BrowserActivity?loadUrl=' + window.location.href, () => {
          // 下载App
          this.mSendEvLog('downloadpopup_show', label, '1')
          this.$refs.loading.finish()
          this.$refs.confirm.show(
            'Pakua Startimes ON app na shiriki BSS2019',
            () => {
              this.mSendEvLog('downloadpopup_clickok', label, '1')
              downApk.call(this)
              addTicketByDownload.call(this, this.vote_id)
            },
            () => {
              this.mSendEvLog('downloadpopup_clicknot', label, '1')
            },
            'PAKUA',
            'FUTA'
          )
        })
      }
    },
    // 播放视频方法
    toPlayer(advisor) {
      if (this.appType == 0) {
        this.callOrDownApp('programs')
        return
      }
      if (advisor.link_vod_code) {
        playVodinApp.call(this, this.appType, advisor.link_vod_code)
      }
    },
    closeShadow() {
      document.body.style.overflow = 'auto'
      document.body.style.position = 'static'
      this.show_rules = false
      this.show_awards = false
      this.$nextTick(() => {
        if (this.scrollWrapper) {
          this.scrollPop.destroy()
          this.scrollWrapper.enable()
        }
      })
    },
    // 签到增票
    getVoteRemain() {
      this.$axios({
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
          vote_id: this.vote_id
        }),
        url: '/voting/v1/ticket/sign-in'
      })
        .then(res => {
          if (res.data.code == 0 || res.data.code == 1) {
            if (this.$serverTime >= this.startTime && this.$serverTime <= this.endTime) {
              this.voteLeft = res.data.data
              this.getLeftLottery()
            } else {
              this.voteLeft = 0
              this.lotteryLeft = 0
            }
          } else {
            this.voteLeft = 0
            this.lotteryLeft = 0
            this.$refs.alert.show('Sign In Error! ' + res.data.message)
          }
        })
        .catch(err => {
          this.voteLeft = 0
          this.lotteryLeft = 0
          this.$refs.alert.show('Sign In Error!! ' + err)
        })
    },
    // 获取剩余抽奖机会
    getLeftLottery() {
      if (this.$serverTime >= this.startTime && this.$serverTime < this.endTime) {
        this.$axios
          .get(`/voting/v1/lottery/chance?lottery_id=${this.lottery_id}&vote_id=${this.vote_id}`)
          .then(res => {
            if (res.data.code === 0) {
              this.lotteryLeft = res.data.data
            } else {
              this.lotteryLeft = 0
              this.$refs.alert.show(res.data.message)
            }
          })
          .catch(err => {
            this.lotteryLeft = 0
            this.$refs.alert.show('Get lottery chance error!! ' + err)
          })
      }
    },
    // 获取往期视频
    getVideoMsg() {
      this.$axios.get(`/voting/v1/program?vote_id=${this.vote_id}`).then(res => {
        if (res.data.code === 0) {
          res.data.data.forEach(item => {
            if (item.name.indexOf('video') >= 0) {
              this.clipsList.push(item)
            }
          })
        }
      })
    },
    getAwardsList() {
      this.$axios.get(`/voting/lottery/v1/user/winnings?lottery_id=${this.lottery_id}&user_id=${this.$user.id}`).then(res => {
        if (res.data.code === 0) {
          this.awardsList = res.data.data
          console.log(this.awardsList)
        }else {
          this.$refs.alert.show('Get Prize List Error! '+res.data.message)
        }
      }).catch(err=>{
        this.$refs.alert.show('Get Prize List Error!! ' + err)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  background-color: #000;
  div,
  li,
  img {
    box-sizing: border-box;
  }
}
.top {
  position: relative;
  .bg-img {
    width: 100%;
  }
  .tab-box {
    width: 100%;
    position: absolute;
    top: 40%;
    z-index: 1;
    > img {
      height: 3rem;
      position: absolute;
      top: 0;
      &:first-child {
        left: 0;
      }
      &:last-child {
        right: 0;
      }
    }
  }
}

.page-vote {
  padding-bottom: 1rem;
  > img {
    display: block;
    margin: 0 auto;
    padding: 1rem 0 ;
    width: 90%;
  }
  .lottery-type {
    width: 90%;
    background-color: #fab512;
    margin: 0 auto;
    border-radius: 0.5rem;
    padding: 1rem 2%;
    position: relative;
    z-index: 2;
    .count {
      width: 11rem;
      height: 1.5rem;
      line-height: 1.5rem;
      border-radius: 0.2rem;
      color: #fff;
      background-color: #a57200;
      text-align: center;
      margin: 0 auto 0.5rem;
      font-size: 0.75rem;
    }
    .tip {
      width: 100%;
      height: 1.3rem;
      font-size: 0.75rem;
      line-height: 1.3rem;
      text-align: center;
      color: #9a6100;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.text4 {
  display: block;
  margin: 0.5rem auto 1.5rem;
  width: 70%;
}
.past-programme {
  margin: 0 auto;
  width: 100%;
  padding-bottom: 1rem;
  img {
    width: 100%;
    display: block;
  }
  ul {
    width: 90%;
    margin: 0 auto;
    li {
      float: left;
      width: 48.5%;
      &:nth-child(2n) {
        float: right;
      }
      div {
        position: relative;
        width: 100%;
        .url {
          width: 100%;
          height: 100%;
          border-radius: 0.3rem;
          position: absolute;
          top: 0;
        }
        &:before {
          content: '';
          display: inline-block;
          padding-bottom: 62%;
          width: 0.1px;
          vertical-align: middle;
        }
      }
      .title {
        margin: 0.5rem 0;
        width: 100%;
        height: 2rem;
        line-height: 1rem;
        color: #fff;
        font-size: 0.75rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
  }
}
.rules-box {
  width: 17rem;
  height: 26rem;
  line-height: 1.2rem;
  position: fixed;
  overflow: hidden;
  top: 50%;
  left: 50%;
  margin-left: -8.5rem;
  margin-top: -13rem;
  z-index: 999;
  img {
    &:first-child {
      width: 100%;
      display: block;
    }
    &:last-child {
      width: 10%;
      display: block;
      margin: 1.5rem auto 0;
    }
  }
  .rule-text {
    width: 15rem;
    height: 16.5rem;
    color: #4f3b16;
    position: absolute;
    left: 1rem;
    top: 4rem;
    padding: 0 1rem;
    overflow-x: hidden;
    overflow-y: scroll;
    font-size: 0.8rem;
    &::-webkit-scrollbar {
      display: none;
    }
    p {
      margin-bottom: 0.5rem;
    }
  }
}
.awards-box {
  width: 17rem;
  height: 26rem;
  line-height: 1.2rem;
  position: fixed;
  overflow: hidden;
  top: 50%;
  left: 50%;
  margin-left: -8.5rem;
  margin-top: -13rem;
  z-index: 999;
  img {
    &:first-child {
      width: 100%;
      display: block;
    }
    &:last-child {
      width: 10%;
      display: block;
      margin: 1.5rem auto 0;
    }
  }
  .award-item {
    width: 15rem;
    height: 11.5rem;
    position: absolute;
    left: 1rem;
    top: 8.5rem;
    padding: 0 0.5rem;
    overflow-x: hidden;
    overflow-y: scroll;
    font-size: 0.8rem;
    &::-webkit-scrollbar {
      display: none;
    }
    ul li {
      line-height: 2.2rem;
      img {
        width: 2.2rem;
        height: 2.2rem;
        display: inline-block;
        margin-right: 0.5rem;
        vertical-align: middle;
      }
      span {
        width: 5.5rem;
        height: 2.2rem;
        display: inline-block;
        color: #949494;
        &:nth-child(2) {
          margin-right: 0.3rem;
          color: #4f3b16;
        }
      }
    }
  }
}
.shadow-box {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: -2.1rem;
  opacity: 0.5;
  background-color: #000;
  z-index: 998;
}
</style>
