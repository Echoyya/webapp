<template>
  <div class="wrapper">
    <div class="container">
      <div class="top">
        <img src="@/assets/img/vote/BSSVote3/img-banner.png" alt="bg-img" class="bg-img" />
        <div class="tab-box">
          <img src="@/assets/img/vote/BSSVote3/ic-rule.png" @click="showRule" />
          <img src="@/assets/img/vote/BSSVote3/ic-share.png" @click="showAward" />
        </div>
      </div>
      <div class="page-vote">
        <img v-if="appType!==0" src="@/assets/img/vote/BSSVote2/img-share.png" class="share" @click="toShare('home')" />
        <img v-else src="@/assets/img/vote/BSSVote2/img-share.png" class="share" @click="callOrDownApp('download now')" />
        <div class="lottery-type">
          <div class="count">CHANCES REMAINING:{{ appType > 0 && isLogin ? (lotteryLeft > 0 ? lotteryLeft : 0) : 0 }}</div>
          <lottery
            ref="lottery"
            :id="lottery_id"
            :defaultPrizeIndex="7"
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
      <img v-if="clipsList.length>0" class="text text4" src="@/assets/img/vote/BSSVote3/text4.png" alt />
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
      <img src="@/assets/img/vote/BSSRegister/bg-rule.png" alt />
      <div class="rule-text">
        <div>
          1.
          <span>Fainali ya kupiga kura</span>: kuanzia tarehe 22 Disemba 2019 saa 4:00 usiku mpaka Disemba 24, 2019 saa 5:00 Usiku.
          <br />2.
          <span>Sheria za fainali za kupiga kura</span>: tafuta na pakua APP ya StarTimes ON kwenye simu yako ya mkononi kisha ingia sehemu ya kupigia kura, washiriki wa Bongo Star Search 2019 na umpigie kura mshiriki umpendae.
          <br />a. Watumiaji wa kawaida wa APP ya StarTimes ON watapata nafasi 5 kila siku kupigia kura kwa kila mshiriki aliyeingia 5 bora au kupiga kura zote 5 kwa mshiriki mmoja aliyempenda.
          <br />b. Watumiaji Maalumu(VIP): Mtumiaji mpya kujisajili na StarTimes On atapata nafasi ya kupiga kura 50 kwa washiriki wa BSS. Mtumiaji ambaye ameshajisajili kabla na akajiunga na kifurushi cha VIP atajipatia nafasi 50 za kupiga kura siku inayofuata.
          <br />Mbali na hilo, share link na marafiki wapakue APP ya StarTimes ON ujipatie kura zaidi. Kila Mtumiaji mpya wa APP utakayemualika atakupa nafasi 5 zaidi za kupiga kura. Kadiri unavyoalika marafiki ndivyo unavyojiongezea nafasi za kupiga kura.
          <br />3.
          <span>Zawadi</span>: ukipiga kura 5 utakuwa kwenye nafasi ya kupata zawadi ya sabufa ya Tsh 85,000, na bluetooth ya Aborder ni Tsh 35,000, VIP wa APP ya StartimesON na kuponi.
          <br />4.
          <span>Tathmini ya upigaji kura</span>: ili kutendea haki washiriki walio katika fainali, kura zitahesabiwa papo hapo.Nafasi ya mwisho ya washiriki itakua na sehemu tatu ya kupiga kura zikiwemo: kupiga kura kupitia Startimes ON, upigaji kura kwa ujumbe mfupi, na kupiga kura moja kwa moja ukumbini. Na akaunti za kupiga kura kupitia Startimes ON zitachukua uzito wa asilimia 30.
          <br />5.
          <span>Kutangazwa kwa matokeo ya fainali</span>: Mashindano ya fainali yatarushwa Live na matokeo ya mwisho ya kura yatarushwa Live vilevile.
        </div>
      </div>
      <img src="@/assets/img/vote/BSSRegister/ic-close.png" alt @click="closeShadow" />
    </div>
    <div v-show="show_awards" class="awards-box">
      <img src="@/assets/img/vote/BSSRegister/bg-rule.png" alt />
      <div class="award-item">
        <ul v-if="awardsList.length>0">
          <li v-for="(item, i) in awardsList" :key="i">
            <img :src="item.icon" alt />
            <span>{{item.name}}</span>
            <span>{{item.time}}</span>
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
import lottery from '@/components/lottery'
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
      vote_id: getQuery('voteid') || 64,
      lottery_id: this.$appType == 2 ? 7 : 6,
      startTime: '',
      endTime: '',

      imgUrl: 'http://cdn.startimestv.com/banner/BSSVote3-banner.png',
      shareTitle: 'Comedy Show',
      shareText: "Come on, I'm drawing the Alibaba's Jan 1st Concert Ticket Free, Join with me!",
      show_rules: false,
      show_awards: false,
      appType: this.$appType,
      isLogin: this.$isLogin,

      scrollWrapper: null,
      scrollPop: null,

      showMsg: true,
      clipsList: [],
      awardsList: [
        {
          name: 'VIP 30 DAYS',
          icon: 'http://cdn.startimestv.com/banner/bss-month1.png',
          time: '2020-02-02'
        },
        {
          name: 'VIP 7 DAYS',
          icon: 'http://cdn.startimestv.com/banner/bss-month1.png',
          time: '2020-02-08'
        }
      ],

      // 抽奖
      voteLeft: 0,
      click: true,
      lotteryLeft: 0
    }
  },
  computed: {
    lotteryBtnGray() {
      return this.appType > 0 && this.$isLogin && this.lotteryLeft <= 0
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
      if (prize.prizeIndex <= 2) {
        setTimeout(() => {
          this.$refs.alert.show(
            `Hit the Jackpot! You've got ${prize.name}!`,
            () => {
              if (prize.prizeIndex == 1) {
                this.toShare('ticket')
              } else if (prize.prizeIndex == 2) {
                this.toShare('30dayvip')
              }
              this.click = true
            },
            'Share the joy with friends'
          )
        }, 1000)
      } else if (prize.prizeIndex <= 5) {
        setTimeout(() => {
          this.$refs.alert.show(
            `So lucky! You've got ${prize.name}!`,
            () => {
              if (prize.prizeIndex == 3 || prize.prizeIndex == 5) {
                this.toShare('1dayvip')
              } else if (prize.prizeIndex == 4) {
                this.toShare('7dayvip')
              }
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
      } else if (prize.prizeIndex === 7) {
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
        url: '/voting/v2/ticket/sign-in'
      })
        .then(res => {
          if (res.data.code == 0 || res.data.code == 1) {
            if (this.$serverTime >= this.startTime && this.$serverTime <= this.endTime) {
              this.voteLeft = res.data.data.ticket
              this.getLeftLottery()
            } else {
              this.voteLeft = 0
              this.lotteryLeft = 0
            }
            this.isOttVip = res.data.data.user_ott_flag
            this.isLinkVip = res.data.data.user_dvb_flag
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
    }
  }
}
</script>
<style lang="less" scoped>
@keyframes go_in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes add_one {
  0% {
    opacity: 1;
    transform: scale(0);
  }
  100% {
    opacity: 0.2;
    transform: scale(5);
  }
}
.wrapper {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  background-color: #141515;
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
    padding-top: 1rem;
    width: 95%;
    &.share {
      width: 90%;
      padding: 1.5rem 0 0.5rem;
    }
  }
  .lottery-type {
    width: 90%;
    background-color: #fab512;
    margin: 1rem auto 0;
    border-radius: 0.5rem;
    padding: 1rem 2%;
    position: relative;
    z-index: 2;
    /deep/ .lottery ul li {
      &:nth-child(1),
      &:nth-child(2) {
        background-image: url('~@/assets/img/vote/BSSRegister/bg-lottery-light.png');
        background-size: 100% 100%;
      }
    }
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
    color: #1b9145;
    position: absolute;
    left: 1rem;
    top: 4rem;
    padding: 0 0.5rem;
    overflow-x: hidden;
    overflow-y: scroll;
    font-size: 0.8rem;
    &::-webkit-scrollbar {
      display: none;
    }
    span {
      font-weight: bold;
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
    height: 16.5rem;
    color: #1b9145;
    position: absolute;
    left: 1rem;
    top: 4rem;
    padding: 0 0.5rem;
    overflow-x: hidden;
    overflow-y: scroll;
    font-size: 0.8rem;
    &::-webkit-scrollbar {
      display: none;
    }
    ul li {
      img {
        width: 2.2rem;
        height: 2.2rem;
        display: inline-block;
        margin-right: 0.5rem;
      }
      span {
        width: 5.5rem;
        display: inline-block;
        &:nth-child(1) {
          width: 6rem;
          margin-right: 0.3rem;
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
