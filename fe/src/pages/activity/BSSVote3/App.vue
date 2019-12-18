<template>
  <div class="wrapper">
    <div class="container">
      <div class="top">
        <img src="@/assets/img/vote/BSSVote3/img-banner.png" alt="bg-img" class="bg-img" />
        <div class="tab-box">
          <img src="@/assets/img/vote/BSSVote3/ic-rule.png" @click="showRule" />
          <img src="@/assets/img/vote/BSSVote3/ic-share.png" @click="toShare('upshare')" />
        </div>
      </div>
      <div class="page-control">
        <p :class="{ active: pageVote }" @click="changePage('vote')">KURA</p>
        <p :class="{ active: !pageVote }" @click="changePage('barrage')">MAONI</p>
      </div>
      <div v-if="pageVote" class="page-vote">
        <img class="text text1" src="@/assets/img/vote/BSSVote3/text1.png" alt />
        <div class="date">DESEMBA 22 - DESEMBA 24</div>
        <div class="vote-box">
          <div class="vote-remaining">
            <div class="remain">KURA ZILIZOBAKI:{{ appType == 0 ? 0 : voteLeft > 0 ? voteLeft : 0 }}</div>
          </div>
          <div v-if="advisorList.length > 0">
            <ul class="clearfix">
              <li v-for="(item, key) in advisorList" :key="key">
                <div class="item-box">
                  <div>
                    <img :src="item.icon + '?w=150'" class="icon" @click="toPlayer(item, 'votepic_click', item.name)" />
                  </div>
                  <span class="name">{{ item.name.toUpperCase() }}</span>
                </div>
                <div class="vote-btn" @click="handleViceVote(item)">KURA</div>
              </li>
            </ul>
          </div>
        </div>
        <img class="text text2" src="@/assets/img/vote/BSSVote3/text2.png" alt />
        <div class="more-vote">
          <div class="vip">
            <!-- APP外、匿名、登录都不是会员 -->
            <img v-if="appType == 0 || (appType > 0 && !isOttVip && !isLinkVip)" src="@/assets/img/vote/BSSVote3/ic-noOtt-noLink.png" alt />
            <!-- 都是会员 -->
            <img v-if="appType > 0 && isOttVip && isLinkVip" src="@/assets/img/vote/BSSVote3/ic-isOtt-isLink.png" alt />
            <!-- 是OTT 不是LINK -->
            <img v-if="appType > 0 && isOttVip && !isLinkVip" src="@/assets/img/vote/BSSVote3/ic-isOtt-noLink.png" alt />
            <!-- 不是OTT 是LINK -->
            <img v-if="appType > 0 && !isOttVip && isLinkVip" src="@/assets/img/vote/BSSVote3/ic-noOtt-isLink.png" alt />
            <div v-if="appType == 0 || (appType > 0 && !isOttVip)" class="op open-ott" @click="toVip('ottvip')"></div>
            <div v-if="appType == 0 || (appType > 0 && !isLinkVip)" class="op open-dvb" @click="toVip('dvbvip')"></div>
          </div>
          <img v-if="appType > 0 && isLogin" src="@/assets/img/vote/BSSVote3/ic-2login.png" alt />
          <img v-else src="@/assets/img/vote/BSSVote3/ic-2login-no.png" alt @click="toSignIn" />
          <img src="@/assets/img/vote/BSSVote3/ic-3share.png" alt @click="toShare('invite')" />
          <div class="num">
            <p>FANIKIWA KUALIKA RAFIKI {{ share_num }}</p>
          </div>
        </div>
        <img src="@/assets/img/vote/BSSVote2/img-share.png" class="share" @click="toShare('midshare')" />
        <img v-if="appType > 0 && !isLogin" class="text text3" src="@/assets/img/vote/BSSVote3/text3-login-no.png" @click="toSignIn" />
        <img v-if="!(appType > 0 && !isLogin)" class="text text3" src="@/assets/img/vote/BSSVote3/text3-login.png" alt />
        <div class="lottery-type">
          <div class="count">NAFASI ZILIZOBAKI:{{ appType > 0 && isLogin ? (lotteryLeft > 0 ? lotteryLeft : 0) : 0 }}</div>
          <lottery
            ref="lottery"
            :id="lottery_id"
            :defaultPrizeIndex="7"
            :withMsgList="showMsg"
            :btnGray="lotteryBtnGray"
            :btnText="'Anza'"
            :hasGotText="'umeshinda'"
            @drawClick="startDraw"
            @end="endLottery"
            @getItemsError="lotteryError"
            @getResultError="lotteryError"
          ></lottery>
          <div class="tip">
            <p>TAFUTA ZAWADI KWENYE ME -> KUPONI YANGU</p>
          </div>
        </div>
      </div>
      <div v-else class="page-barrage">
        <div class="topic">
          <img class="title" :src="topic + '?w=350'" alt />
          <div class="pick-box">
            <div class="left">
              <div>
                <img v-if="pageList[index]" :src="pageList[index].candidates[0].icon + '?w=250'" alt />
              </div>
            </div>
            <div class="middle">
              <img src="@/assets/img/vote/BSSVote3/ic-or.png" alt />
              <img src="@/assets/img/vote/BSSVote3/ic-pick-text.png" alt />
              <p>{{ allNum }}</p>
            </div>
            <div class="right">
              <div>
                <img v-if="pageList[index]" :src="pageList[index].candidates[1].icon + '?w=250'" alt />
              </div>
            </div>
            <div v-show="!picked || appType == 0" class="pick">
              <div v-if="pageList[index]" class="btn" @click="handlePick('left', pageList[index].candidates)">CHAGUA</div>
              <div v-if="pageList[index]" class="btn" @click="handlePick('right', pageList[index].candidates)">CHAGUA</div>
            </div>
            <div v-show="picked && appType > 0" class="progress" :class="{ 'show-in': show_in }">
              <div class="bar l"></div>
              <div class="bar r"></div>
              <div class="left">{{ leftNum }}%</div>
              <div class="right">{{ rightNum }}%</div>
              <span class="add-one l" :class="{ 'l-show': l_show }">+1</span>
              <span class="add-one r" :class="{ 'r-show': r_show }">+1</span>
            </div>
          </div>
        </div>
        <div id="comment" class="comment">
          <div class="comment-box">
            <baberrage :isShow="true" :barrageList="barrageList" :loop="false" :throttleGap="1500"></baberrage>
          </div>
          <div class="send-box">
            <textarea v-model="commentText" type="text" placeholder="SHIRIKISHA HISIA YAKO..." maxlength="100" @focus="inputFocus" @blur="inputBlur" />
            <div class="btn" @click="sendComment">
              <img src="@/assets/img/vote/BSSVote3/ic-send.png" alt />
              <span>{{ disabled ? `${during}s` : `TUMA` }}</span>
            </div>
          </div>
        </div>
        <img src="@/assets/img/vote/BSSVote2/img-share.png" class="share" @click="toShare('midshare')" />
      </div>
      <img class="text text4" src="@/assets/img/vote/BSSVote3/text4.png" alt />
      <div class="past-programme">
        <ul class="clearfix">
          <li v-for="(item, i) in clipsList" :key="i">
            <div @click="toPlayer(item, 'video_click', item.description)">
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
      <div class="share-btn" @click="toShare('voterules')">SHIRIKI</div>
      <img src="@/assets/img/vote/BSSRegister/ic-close.png" alt @click="closeShadow" />
    </div>
    <div v-show="votePannel" class="handle-pick-box">
      <img src="@/assets/img/vote/BSSVote2/ic-pick.png" alt />
      <div class="title">CHAGUA KURA ZAKO</div>
      <div class="votes">Kura zilizobaki: {{ voteLeft }}</div>
      <div class="pick">
        <div class="vote-value" :class="voteLeft >= 1 ? 'abled' : 'disabled'" @click="handleVote(1)">+1</div>
        <div class="vote-value" :class="voteLeft >= 5 ? 'abled' : 'disabled'" @click="handleVote(5)">+5</div>
        <div class="vote-value" :class="voteLeft >= 10 ? 'abled' : 'disabled'" @click="handleVote(10)">+10</div>
      </div>
      <div class="cancel" @click="closeShadow">GHAIRI</div>
    </div>
    <div v-show="show_rules || votePannel" class="shadow-box" @click="closeShadow"></div>
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
import {
  callApp,
  downApk,
  playVodinApp,
  toNativePage,
  shareInvite,
  shareInviteIos,
  addTicketByDownload,
  getQuery,
  callAppleStore
} from '@/functions/app'
import { getBrowser } from '@/functions/utils'
import baberrage from '@/components/baberrage/index'
import env from '@/functions/config'
export default {
  components: {
    mShare,
    alertDialog,
    confirmDialog,
    toastDialog,
    baberrage,
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
      shareTitle: 'Bongo Star Search 2019',
      shareText: 'Kura yako muhimu! Mpigie kura awe mshindi wa Bongo Star Search',
      show_rules: false,
      appType: this.$appType,
      isLogin: this.$isLogin,

      scrollWrapper: null,
      scrollRule: null,

      share_num: 0,
      clipsList: [],
      topicList: [],
      pageVote: true,
      isOttVip: false,
      isLinkVip: false,

      currentId: 0,
      barrageIndex: 0,
      barrageList: [],
      t: null,

      // 投票
      voteLeft: 0,
      advisorList: [],
      canVotes: true,
      showMsg: true,
      votePannel: false,
      votePickItem: -1, // 准备投票的投票单元id

      // 抽奖
      click: true,
      lotteryLeft: 0,

      // 弹幕
      barrage_id: getQuery('barrageid') || 17,
      topic: '',
      during: 5, // 发送弹幕后倒计时
      disabled: false, // send状态
      index: 0, // 当前所在的节目期数
      commentList: [],
      words: ['kuma', 'mbolo', 'mpumbavu', 'mshenzi', 'matako', 'pumbavu', 'msenge'],
      show_in: false,
      l_show: false,
      r_show: false,
      timeList: [],
      currentPage: 1, // 当前所在期数
      pageList: [],
      leftNum: 0,
      rightNum: 0,
      leftNumVal: 0,
      rightNumVal: 0,
      allNum: 0,
      picked: false, // 是否已经投票
      canVote: true, // 防多pick
      time: null, // 弹幕滚动定时器
      commentText: '', // 发送的内容
      number: 20, // 每次请求的弹幕数量
      last_id: 0, // 上一次请求的最后一条弹幕id
      canClickTab1: false,
      canClickTab2: false
    }
  },
  computed: {
    lotteryBtnGray() {
      return this.appType > 0 && this.$isLogin && this.lotteryLeft <= 0
    }
  },
  mounted() {
    this.mSendEvLog('page_show', '', '')
    this.barrageBox = document.getElementsByClassName('baberrage-stage')
    this.getLotteryInfo()
    const browser = getBrowser()
    // 解决scroll卡顿在789系统
    if (browser.isAndroid && browser.androidVer >= 7) {
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
            this.getAdvisorList()
            this.getVoteRemain()
            this.getLeftLottery()
            this.getVideoMsg()
            this.getShareNum()
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
      if (this.appType == 0 || !this.isLogin || this.$serverTime < this.startTime || this.$serverTime >= this.endTime || this.lotteryLeft <= 0) {
        this.mSendEvLog('lottery_click', '', '-1')
      }
      if (this.appType == 0) {
        this.callOrDownApp('lottery')
        return
      }
      if (!this.isLogin) {
        this.$refs.alert.show(
          'Tafadhali jisajili ili uanze mchuano wa bahati.',
          () => {
            this.toSignIn()
          },
          'JISAJILI'
        )
        return
      }
      if (this.$serverTime < this.startTime) {
        this.$refs.alert.show('Upigaji kura utaanza tarehe 23th Desemba, kwa hiyo kaa tayari!', () => {}, 'SAWA')
        return
      }
      if (this.$serverTime >= this.endTime) {
        this.$refs.alert.show('Samahani, kura zimekwisha.', () => {}, 'SAWA')
        return
      }
      if (this.lotteryLeft <= 0) {
        // 票不够不能抽奖
        this.$refs.alert.show('Piga kura ili upate nafasi ya kupata zawadi! Kila kura 5 kwa mchezo 1', () => {}, 'SAWA')
        return
      }
      this.click = false
      this.canClickTab2 = false
      this.lotteryLeft--
      this.$refs.lottery.tween()
    },
    endLottery(prize) {
      if (prize.prizeIndex < 5) {
        if (prize.prizeIndex == 2) this.mSendEvLog('lottery_click', 'vip', '1')
        else if (prize.prizeIndex == 3) this.mSendEvLog('lottery_click', '40offcoupon', '1')
        else if (prize.prizeIndex == 4) this.mSendEvLog('lottery_click', '30offcoupon', '1')
        setTimeout(() => {
          this.$refs.alert.show(
            'Hongera! Umepata ' + prize.name + '! Zawadi zitatolewa kwenye siku ya pili ya kazi katika Me-> Kuponi zangu.',
            () => {
              this.click = true
              this.canClickTab2 = true
            },
            'SAWA'
          )
        }, 1000)
      } else if (prize.prizeIndex == 5) {
        this.mSendEvLog('lottery_click', 'morevotes', '1')
        this.getTicketAward(res => {
          if (res.data.code == 200) {
            setTimeout(() => {
              this.$refs.alert.show(
                'Hongera! Umepata kura ' + res.data.data + ' zaidi!',
                () => {
                  this.click = true
                  this.canClickTab2 = true
                },
                'SAWA'
              )
              this.voteLeft += res.data.data
            }, 1000)
          } else {
            this.$refs.alert.show('Get ticket award error!' + res.data.message)
          }
        })
      } else if (prize.prizeIndex === 6) {
        this.mSendEvLog('lottery_click', 'tryagain', '0')
        setTimeout(() => {
          this.lotteryLeft++
          this.$refs.alert.show(
            'Hongera! Umepata nafasi moja zaidi!',
            () => {
              this.click = true
              this.startDraw()
            },
            'SAWA'
          )
        }, 1000)
      } else if (prize.prizeIndex === 7) {
        this.mSendEvLog('lottery_click', 'sorry', '0')
        setTimeout(() => {
          this.$refs.alert.show(
            'Asante kwa ushiriki wako.',
            () => {
              this.click = true
              this.canClickTab2 = true
            },
            'SAWA'
          )
        }, 1000)
      }
    },
    addToList(v) {
      const maxTime = 5
      const minTime = 3
      let time = 50 / (10 + decodeURI(v.content).length * 0.5)
      if (time > maxTime) time = maxTime
      if (time < minTime) time = minTime
      this.barrageList.push({
        id: ++this.currentId,
        avatar: v.avatar
          ? v.avatar == 'http://cdn.startimestv.com/head/h_d.png'
            ? 'http://cdn.startimestv.com/banner/DD_user_icon.png'
            : v.avatar
          : 'http://cdn.startimestv.com/banner/DD_user_icon.png',
        msg: decodeURI(v.content),
        time: time,
        type: 'NORMAL',
        barrageStyle: 'barrageStyle'
      })
    },
    changePage(page) {
      if (page == 'vote') {
        if (!this.canClickTab1) {
          return
        }
        this.mSendEvLog('tab_click', 'vote', '')
        this.canClickTab1 = false
        this.show_in = false
        this.l_show = false
        this.r_show = false
        const addOnes = document.getElementsByClassName('add-one')
        addOnes[0].style.visibility = 'hidden'
        addOnes[1].style.visibility = 'hidden'
        this.last_id = 0
        clearInterval(this.t)
        this.barrageList = []
        this.pageVote = true
        this.canClickTab2 = true
      } else if (page == 'barrage') {
        if (!this.canClickTab2) {
          return
        }
        this.mSendEvLog('tab_click', 'interact', '')
        this.canClickTab2 = false
        this.pageVote = false
        if (this.pageList.length <= 0) {
          this.getPagelist()
        } else {
          this.$nextTick(() => {
            this.initPage()
          })
          this.getCommentList()
        }
      }
    },
    nowarp() {
      const textdom = document.getElementsByTagName('textarea')[0]
      textdom.addEventListener('keydown', e => {
        if (e.keyCode == 13) {
          e.preventDefault()
          return false
        }
      })
    },
    initPage() {
      // 投票状态
      if (this.pageList[this.index].ticket_num > 0) {
        this.picked = false
        this.show_in = true
      } else {
        this.picked = true
        this.show_in = false
      }
      // 参与人数 百分比
      this.allNum = this.pageList[this.index].candidates[0].ballot_num + this.pageList[this.index].candidates[1].ballot_num
      this.leftNumVal = this.pageList[this.index].candidates[0].ballot_num
      this.rightNumVal = this.pageList[this.index].candidates[1].ballot_num
      if (this.allNum) {
        this.leftNum = parseInt((this.leftNumVal / this.allNum) * 100)
        this.rightNum = 100 - this.leftNum
      }
      const domLeft = document.getElementsByClassName('bar')[0]
      const domRight = document.getElementsByClassName('bar')[1]
      domLeft.style.width = 0.9 * this.leftNum + '%'
      domRight.style.width = 0.9 * this.rightNum + '%'
      if (this.leftNum == 100) {
        domLeft.style.borderRadius = '0.4rem'
      } else if (this.rightNum == 100) {
        domRight.style.borderRadius = '0.4rem'
      } else {
        domLeft.style.borderRadius = '0.4rem 0 0 0.4rem'
        domRight.style.borderRadius = '0 0.4rem 0.4rem 0'
      }
      this.nowarp()
    },
    inputFocus() {
      if (this.scrollWrapper) {
        this.scrollWrapper.scrollTo(0, -document.getElementById('comment').offsetTop)
        this.scrollWrapper.disable()
      } else {
        document.getElementById('comment').scrollIntoView()
      }
    },
    inputBlur() {
      if (this.scrollWrapper) {
        this.scrollWrapper.enable()
        this.scrollWrapper.refresh()
      }
    },
    getIndexToIns(arr, num) {
      const index = arr.findIndex(currentPage => num <= currentPage)
      return index == 0 ? 1 : index < 0 ? arr.length : index
    },
    // 获取期数，播出时间，票数，状态，投票单元
    getPagelist() {
      this.$axios
        .get(`/voting/v3/candidates-show?vote_id=${this.barrage_id}`)
        .then(res => {
          if (res.data.code === 0) {
            this.pageList = res.data.data
            const sortByTime = key => {
              return (on, om) => {
                const vn = on[key]
                const vm = om[key]
                return vn < vm ? -1 : vn > vm ? 1 : 0
              }
            }
            this.pageList.sort(sortByTime('start_time'))
            this.pageList.forEach(item => {
              this.timeList.push(new Date(item.start_time.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime())
            })
            this.currentPage = this.getIndexToIns(this.timeList, this.$serverTime)
            this.topic = this.topicList[this.currentPage - 1].cover
            if (this.index != this.currentPage - 1) {
              this.index = this.currentPage - 1
            }
          } else {
            this.pageList = []
            this.$refs.alert.show('Get barrage candidates show error! ' + res.data.message)
          }
          let flag = true
          for (let i = 0; i < this.pageList.length; i++) {
            if (i <= this.index) {
              if (!this.pageList[i].candidates.length) {
                flag = false
                break
              }
            }
          }
          if (flag) {
            this.initPage()
            this.getCommentList()
          } else {
            this.pageList = []
            this.$refs.alert.show('Get barrage candidates show error!')
          }
        })
        .catch(err => {
          this.pageList = []
          this.$refs.alert.show('Get barrage candidates show error!! ' + err)
        })
    },
    getCommentList() {
      if (this.$serverTime < this.startTime) {
        this.canClickTab1 = true
        return
      }
      this.$axios
        .get(`/voting/v1/comments?comment_activity_id=${this.index + 18}&last_id=${this.last_id}&num_per_page=${this.number}`)
        .then(res => {
          if (res.data.code === 0) {
            this.last_id = res.data.data[res.data.data.length - 1].id
            this.commentList = res.data.data
            this.canClickTab1 = true
            this.addToList(this.commentList[0])
            this.barrageIndex = 1
            this.t = setInterval(() => {
              if (this.barrageIndex >= this.number) {
                this.barrageIndex = 0
                clearInterval(this.t)
                this.barrageList = []
                this.getCommentList()
              } else {
                this.addToList(this.commentList[this.barrageIndex])
                this.barrageIndex++
              }
            }, 1500)
          } else {
            this.commentList = []
            this.$refs.alert.show('Get comment list error! ' + res.data.message)
          }
        })
        .catch(err => {
          this.commentList = []
          this.$refs.alert.show('Get comment list error!! ' + err)
        })
    },
    handlePick(local, advisorList) {
      if (!this.canVote) {
        return
      }
      this.canVote = false
      // web引导下载
      if (this.appType == 0) {
        this.callOrDownApp('pick')
        this.canVote = true
        return
      }
      // 活动未开始提示
      if (this.$serverTime < this.startTime) {
        this.$refs.alert.show(
          'Upigaji kura utaanza tarehe 23th Desemba, kwa hiyo kaa tayari!',
          () => {
            this.canVote = true
          },
          'SAWA'
        )
        return
      }
      // 活动已结束提示
      if (this.$serverTime >= this.endTime) {
        this.$refs.alert.show(
          'Samahani, kura zimekwisha.',
          () => {
            this.canVote = true
          },
          'SAWA'
        )
        return
      }
      let num = 0
      local == 'left' ? (num = 0) : (num = 1)
      // 投票接口
      this.$axios({
        url: '/voting/v1/ballot',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
          candidate_id: advisorList[num].id,
          vote_id: this.barrage_id
        })
      })
        .then(res => {
          if (res.data.code === 0) {
            this.mSendEvLog('pick_click', local == 'left' ? 'A' : 'B', '')
            this.pageList[this.index].candidates[num].ballot_num++
            this.pageList[this.index].ticket_num = 0
            // 动画
            this.allNum++
            local == 'left' ? this.leftNumVal++ : this.rightNumVal++
            this.leftNum = parseInt((this.leftNumVal / this.allNum) * 100)
            this.rightNum = 100 - this.leftNum
            const domLeft = document.getElementsByClassName('bar')[0]
            const domRight = document.getElementsByClassName('bar')[1]
            const addOnes = document.getElementsByClassName('add-one')
            if (local == 'left') {
              addOnes[0].style.visibility = 'visible'
              this.l_show = true
              setTimeout(() => {
                addOnes[0].style.visibility = 'hidden'
              }, 2000)
            } else {
              addOnes[1].style.visibility = 'visible'
              this.r_show = true
              setTimeout(() => {
                addOnes[1].style.visibility = 'hidden'
              }, 2000)
            }
            domLeft.style.width = 0.9 * this.leftNum + '%'
            domRight.style.width = 0.9 * this.rightNum + '%'
            if (this.leftNum == 100) {
              domLeft.style.borderRadius = '0.4rem'
            } else if (this.rightNum == 100) {
              domRight.style.borderRadius = '0.4rem'
            } else {
              domLeft.style.borderRadius = '0.4rem 0 0 0.4rem'
              domRight.style.borderRadius = '0 0.4rem 0.4rem 0'
            }
            this.picked = true
            this.show_in = true
            if (local == 'left') {
              this.show_l = true
            } else if (local == 'right') {
              this.show_r = true
            }
            this.canVote = true
          } else {
            this.$refs.alert.show('Pick error! ' + res.data.message)
            this.canVote = true
          }
        })
        .catch(err => {
          this.$refs.alert.show('Pick error!! ' + err)
          this.canVote = true
        })
    },
    sendComment() {
      // 防多点
      if (this.disabled) {
        return
      }
      this.disabled = true
      this.canClickTab1 = false
      // web引导下载
      if (this.appType == 0) {
        this.callOrDownApp('send')
        this.commentText = ''
        this.disabled = false
        this.canClickTab1 = true
        return
      }
      // 活动未开始提示
      if (this.$serverTime < this.startTime) {
        this.$refs.alert.show('Upigaji kura utaanza tarehe 23th Desemba, kwa hiyo kaa tayari!', () => {}, 'SAWA')
        this.commentText = ''
        this.disabled = false
        this.canClickTab1 = true
        return
      }
      // 活动已结束提示
      if (this.$serverTime >= this.endTime) {
        this.$refs.alert.show('Samahani, kura zimekwisha.', () => {}, 'SAWA')
        this.commentText = ''
        this.disabled = false
        this.canClickTab1 = true
        return
      }
      // 输入为空
      if (!this.commentText) {
        this.disabled = false
        this.canClickTab1 = true
        return
      }
      // 屏蔽词
      let flag = false
      if (this.commentText.toLowerCase().match(/[a-zA-Z]+/gi)) {
        this.commentText
          .toLowerCase()
          .match(/[a-zA-Z]+/gi)
          .forEach(item => {
            if (this.words.indexOf(item) >= 0) flag = true
          })
        if (flag) {
          this.commentText = ''
          this.$refs.alert.show(
            'Maoni yako yana maudhui yasiyofaa. Tafadhali ondoa maneno ambayo yatasababisha uvunjaji wa sheria.',
            () => {},
            'SAWA'
          )
          this.disabled = false
          this.canClickTab1 = true
          return
        }
      }
      // 调用发送评论接口
      this.$axios({
        url: '/voting/v1/comment',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
          comment_activity_id: this.index + 18,
          content: encodeURI(this.commentText)
        })
      })
        .then(res => {
          if (res.data.code === 0) {
            this.mSendEvLog('send_click', this.commentText, '')
            const during = this.during
            this.commentList[this.barrageIndex] = {
              id: ++this.currentId,
              avatar: this.$user.head || 'http://cdn.startimestv.com/banner/DD_user_icon.png',
              content: this.commentText
            }
            const duringTime = setInterval(() => {
              this.during--
              if (this.during == 0) {
                clearInterval(duringTime)
                this.during = during
                this.disabled = false
              }
            }, 1000)
            this.commentText = ''
            this.canClickTab1 = true
          } else {
            this.$refs.alert.show('Send comment error! ' + res.data.message)
            this.disabled = false
            this.canClickTab1 = true
            this.commentText = ''
          }
        })
        .catch(err => {
          this.$refs.alert.show('Send comment error!! ' + err)
          this.disabled = false
          this.canClickTab1 = true
          this.commentText = ''
        })
    },
    toVip(vip) {
      if (this.appType == 0) {
        this.callOrDownApp(vip)
      } else if (this.appType == 1) {
        if (!this.isLogin) {
          toNativePage(
            'com.star.mobile.video.account.LoginActivity?returnClass=com.star.mobile.video.activity.BrowserActivity?loadUrl=' +
              encodeURIComponent(window.location.href)
          )
        } else if (this.isLogin) {
          if (vip == 'dvbvip') {
            // 原生DVB
            this.mSendEvLog('dvb_click', '', '')
            toNativePage('com.star.mobile.video.smartcard.changebouquet.ChangeBouquetActivity')
          } else if (vip == 'ottvip') {
            // 原生OTT
            this.mSendEvLog('ott_click', '', '')
            toNativePage('com.star.mobile.video.me.product.MembershipListActivity')
          }
        }
      } else if (this.appType == 2) {
        if (!this.isLogin) {
          this.$iosBridge && this.$iosBridge.callHandler('startLogin')
        } else if (this.isLogin) {
          if (vip == 'dvbvip') {
            // 原生DVB
            this.mSendEvLog('dvb_click', '', '')
            this.$iosBridge &&
              this.$iosBridge.callHandler('toAppPage', {
                pageName: 'dvbLink',
                isBackToSource: false
              })
          } else if (vip == 'ottvip') {
            // 原生OTT
            this.mSendEvLog('ott_click', '', '')
            window.location.href = 'startimes://ottProduct'
          }
        }
      }
    },
    showRule() {
      this.mSendEvLog('rule_click', '', '')
      this.show_rules = true
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.left = '0'
      document.body.style.right = '0'
      this.$nextTick(() => {
        if (this.scrollWrapper) {
          this.scrollWrapper.disable()
          this.scrollRule = new BScroll('.rule-text', {
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
        category: 'form_BSSVote3_' + this.$platform,
        action: action,
        label: label,
        value: value
      })
    },
    // app登录方法
    toSignIn() {
      this.mSendEvLog('signin_click', '', '')
      if (this.appType <= 0) {
        this.callOrDownApp('signin')
      } else if (this.appType == 1) {
        // 原生登录，跳回活动页面
        toNativePage(
          'com.star.mobile.video.account.LoginActivity?returnClass=com.star.mobile.video.activity.BrowserActivity?loadUrl=' +
            encodeURIComponent(window.location.href)
        )
      } else {
        this.$iosBridge && this.$iosBridge.callHandler('startLogin')
      }
    },
    // 调出分享弹层(app/web)
    toShare(label) {
      if (label == 'voterules') this.closeShadow()
      this.mSendEvLog('share_click', label, '')
      const url =
        window.location.href.indexOf('?') >= 0
          ? window.location.href + (this.isLogin ? '&pin=' + this.$user.id : '') + '&utm_source=VOTE&utm_medium=BSS&utm_campaign=' + this.$platform
          : window.location.href + (this.isLogin ? '?pin=' + this.$user.id : '') + '&utm_source=VOTE&utm_medium=BSS&utm_campaign=' + this.$platform
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
        this.$refs.confirm.show(
          'Pakua Startimes ON app na shiriki BSS2019',
          () => {
            this.mSendEvLog('downloadpopup_clickok', label, '')
            addTicketByDownload.call(this, this.vote_id, () => {
              callAppleStore.call(this)
            })
          },
          () => {
            this.mSendEvLog('downloadpopup_clicknot', label, '')
          },
          'PAKUA',
          'FUTA'
        )
      } else {
        this.$refs.loading.start()
        callApp.call(this, 'com.star.mobile.video.activity.BrowserActivity?loadUrl=' + window.location.href, () => {
          // 下载App
          this.mSendEvLog('downloadpopup_show', label, '')
          this.$refs.loading.finish()
          this.$refs.confirm.show(
            'Pakua Startimes ON app na shiriki BSS2019',
            () => {
              this.mSendEvLog('downloadpopup_clickok', label, '')
              downApk.call(this)
              addTicketByDownload.call(this, this.vote_id)
            },
            () => {
              this.mSendEvLog('downloadpopup_clicknot', label, '')
            },
            'PAKUA',
            'FUTA'
          )
        })
      }
    },
    // 获取剩余票数
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
            } else {
              this.voteLeft = 0
            }
            this.isOttVip = res.data.data.user_ott_flag
            this.isLinkVip = res.data.data.user_dvb_flag
          } else {
            this.voteLeft = 0
            this.$refs.alert.show('Sign In Error! ' + res.data.message)
          }
        })
        .catch(err => {
          this.voteLeft = 0
          this.$refs.alert.show('Sign In Error!! ' + err)
        })
    },
    // 获取投票单元数据
    getAdvisorList() {
      this.$axios
        .get(`/voting/v1/candidates-show?vote_id=${this.vote_id}&sort_type=INDEX&size=20`)
        .then(res => {
          if (res.data.code === 0) {
            this.advisorList = res.data.data
          } else {
            this.advisorList = []
            this.$refs.alert.show('Get vote candidates show error!')
          }
        })
        .catch(err => {
          this.advisorList = []
          this.$refs.alert.show('Get vote candidates show error!!' + err)
        })
    },
    // 播放视频方法
    toPlayer(advisor, action, label) {
      this.mSendEvLog(action, label, '')
      if (this.appType == 0) {
        this.callOrDownApp('pic')
        return
      }
      if (advisor.link_vod_code) {
        playVodinApp.call(this, this.appType, advisor.link_vod_code)
      }
    },
    // 投票方法
    handleViceVote(advisor) {
      if (!this.canVotes) {
        return
      }
      this.mSendEvLog('votebtn_click', advisor.name, '')
      if (this.appType == 0) {
        this.callOrDownApp('vote')
        return
      }
      if (this.$serverTime < this.startTime) {
        this.$refs.alert.show('Upigaji kura utaanza tarehe 23th Desemba, kwa hiyo kaa tayari!', () => {}, 'SAWA')
        return
      } else if (this.$serverTime > this.endTime) {
        this.$refs.alert.show('Samahani, kura zimekwisha.', () => {}, 'SAWA')
        return
      }
      if (this.voteLeft <= 0) {
        this.$refs.confirm.show(
          'Samahani, kura yako iliyobaki ni 0, shirikisha marafiki zako na upate kura zaidi.',
          () => {
            this.toShare('votefail')
          },
          () => {},
          'SHIRIKI',
          'FUTA'
        )
      } else {
        this.votePickItem = advisor.id
        this.votePannel = true
      }
    },
    closeShadow() {
      document.body.style.overflow = 'auto'
      document.body.style.position = 'static'
      this.votePannel = false
      this.show_rules = false
      this.$nextTick(() => {
        if (this.scrollWrapper) {
          this.scrollRule.destroy()
          this.scrollWrapper.enable()
        }
      })
    },
    // 投票1，5，10
    handleVote(value) {
      if ((value == 1 && this.voteLeft < 1) || (value == 5 && this.voteLeft < 5) || (value == 10 && this.voteLeft < 10)) {
        this.$refs.toast.show('Kura imeshindikana. Hakuna kura za kutosha zilizobaki.')
        return
      }
      this.canVotes = false
      this.$axios({
        url: '/voting/v1/ballot',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
          candidate_id: this.votePickItem,
          vote_id: this.vote_id,
          count: value
        })
      })
        .then(res => {
          if (res.data.code === 0) {
            if (this.isOttVip || this.isLinkVip) {
              this.mSendEvLog('votecnt_click', 'vip', value)
            } else {
              this.mSendEvLog('votecnt_click', 'nvip', value)
            }
            this.voteLeft -= value
            this.getLeftLottery()
            this.$refs.toast.show('Upigaji umefanikiwa! Umepata nafasi ya kupata zawadi kwa kupitia mchezo wa ukurasa huu.')
            this.canVotes = true
          } else {
            this.$refs.alert.show('Vote error! ' + res.data.message)
            this.canVotes = true
          }
        })
        .catch(err => {
          this.$refs.alert.show('Vote error!! ' + err)
          this.canVotes = true
        })
    },
    // 获取邀请个数信息
    getShareNum() {
      this.$axios
        .get(`/voting/v1/action/count?vote_id=${this.vote_id}&action=SHARE_DOWNLOAD`)
        .then(res => {
          if (res.data.code == 0) {
            this.share_num = res.data.data
          } else {
            this.$refs.alert.show('Get share count error!')
          }
        })
        .catch(err => {
          this.$refs.alert.show('Get share count error!!' + err)
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
    // 获得加票方法
    getTicketAward(callback) {
      let url = '/hybrid/vote/getTicketAward'
      if (env.apiUrl == 'http://upms.startimestv.com') {
        url = 'http://m.startimestv.com' + url
      }
      this.$axios({
        method: 'POST',
        data: {
          vote_id: this.vote_id,
          user_id: this.$user.id
        },
        url: url
      })
        .then(res => {
          callback && callback(res)
        })
        .catch(err => {
          this.$refs.alert.show('Get ticket award error!!' + err)
        })
    },
    // 获取往期视频
    getVideoMsg() {
      this.$axios.get(`/voting/v1/program?vote_id=${this.vote_id}`).then(res => {
        if (res.data.code === 0) {
          res.data.data.forEach(item => {
            if (item.name.indexOf('finals') >= 0) {
              this.clipsList.push(item)
              this.mSendEvLog('video_show', item.description, '')
            } else if (item.name.indexOf('topic') >= 0) {
              this.topicList.push(item)
            }
          })
          this.canClickTab2 = true
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
.page-control {
  width: 100%;
  height: 3rem;
  border-top: 0.1rem solid #fbb508;
  border-bottom: 0.1rem solid #fbb508;
  position: relative;
  margin: -0.3rem auto 0.5rem;
  text-align: center;
  line-height: 3rem;
  background-color: #0c0c0c;
  p {
    color: #fff;
    font-size: 1.2rem;
    display: inline-block;
    width: 50%;
    position: relative;
    &.active {
      color: #fbb508;
      &::before,
      &::after {
        content: '';
        display: block;
        width: 0.3rem;
        height: 0.3rem;
        background-color: #fbb508;
        border-radius: 50%;
        position: absolute;
        top: 1.35rem;
      }
      &::before {
        left: 25%;
      }
      &::after {
        right: 25%;
      }
    }
  }
}
.page-vote {
  .date {
    width: 100%;
    color: #eaad38;
    text-align: center;
    height: 2rem;
    line-height: 1.5rem;
    font-size: 0.75rem;
    padding-top: 0.5rem;
  }
  .vote-box {
    width: 95%;
    background-color: #563f13;
    border-radius: 0.2rem;
    margin: 0.5rem auto 0;
    padding: 1rem 0;
    .vote-remaining {
      width: 100%;
      height: 1.2rem;
      font-size: 0.75rem;
      margin-bottom: 1rem;
      div {
        height: 1.2rem;
        line-height: 1.2rem;
        text-align: center;
        border-radius: 0.2rem;
        background-color: #482801;
        &.remain {
          margin: 0 auto;
          width: 12rem;
          color: #b0872d;
        }
      }
    }
    ul {
      width: 98%;
      height: auto;
      padding: 0 1%;
      position: relative;
      li {
        list-style: none;
        width: 33.33%;
        float: left;
        margin-bottom: 1.3rem;
        .item-box {
          position: relative;
          width: 100%;
          div {
            position: relative;
            width: 83%;
            border-radius: 50%;
            margin: 0 auto;
            overflow: hidden;
            .icon {
              width: 100%;
              height: 100%;
              position: absolute;
              border-radius: 50%;
              top: 0;
            }
            &::before {
              content: '';
              display: inline-block;
              padding-bottom: 100%;
              width: 0.1px;
              vertical-align: middle;
            }
          }
          .name {
            width: 100%;
            height: 2rem;
            padding: 0 0.2rem;
            margin-top: 0.2rem;
            line-height: 1rem;
            font-size: 0.8rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            color: #fff;
            display: block;
            text-align: center;
          }
        }
        .vote-btn {
          width: 4.5rem;
          height: 1.3rem;
          line-height: 1.3rem;
          color: #ffffff;
          background: url('~@/assets/img/vote/BSSRegister/bg-vote.png') no-repeat center;
          background-size: 4.5rem 1.3rem;
          margin: 0 auto;
          margin-top: 0.2rem;
          text-align: center;
          font-size: 0.8rem;
          &:active {
            font-size: 0.75rem;
            background-size: 4.3rem 1.1rem;
          }
        }
      }
    }
  }
  .more-vote {
    width: 95%;
    margin: 1rem auto 0;
    font-size: 0;
    text-align: center;
    position: relative;
    img {
      width: 100%;
    }
    .vip {
      position: relative;
      .op {
        width: 21%;
        position: absolute;
        right: 6%;
        overflow: hidden;
        height: 0;
        &.open-ott {
          padding-bottom: 7%;
          top: 38.5%;
        }
        &.open-dvb {
          padding-bottom: 8%;
          bottom: 15%;
        }
      }
    }
    .num {
      width: 100%;
      height: 1.1rem;
      line-height: 1.1rem;
      position: absolute;
      bottom: 1.7rem;
      left: 0;
      font-size: 0.75rem;
      p {
        display: block;
        border-radius: 0.2rem;
        width: 13rem;
        margin: 0 auto;
        color: #a3a3a3;
      }
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
.handle-pick-box {
  width: 100%;
  height: 16rem;
  position: fixed;
  left: 0;
  bottom: 0;
  color: #333;
  background-color: #fff;
  z-index: 999;
  padding-top: 1rem;
  text-align: center;
  img {
    display: block;
    width: 4rem;
    height: 4rem;
    margin: 0 auto;
  }
  .title {
    width: 100%;
    height: 1.5rem;
    line-height: 1.5rem;
    margin-top: 1rem;
  }
  .votes {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    font-size: 0.75rem;
    color: #ef8856;
  }
  .pick {
    width: 100%;
    height: 3.5rem;
    font-size: 0;
    border-bottom: 1px solid #e7e7e7;
    margin-top: 1rem;
    padding: 0 1rem;
    .vote-value {
      display: inline-block;
      width: 30%;
      height: 2rem;
      line-height: 2rem;
      font-size: 0.9rem;
      margin-left: 3.33%;
      background-color: #f5f5f5;
      border: 1px solid transparent;
      &:first-child {
        margin-left: 0;
      }
      &.abled:active {
        color: #ec5328;
        border: 1px solid #ec5328;
      }
      &.disabled {
        color: #cfcfcf;
      }
    }
  }
  .cancel {
    width: 100%;
    height: 3rem;
    color: #979797;
    line-height: 3rem;
  }
}
.page-barrage {
  .topic {
    width: 100%;
    position: relative;
    .title {
      width: 90%;
      margin: 1rem 5% 1rem;
    }
    .pick-box {
      font-size: 0;
      width: 100%;
      .left,
      .right {
        font-size: 0.9rem;
        width: 40%;
        position: relative;
        overflow: hidden;
        display: inline-block;
        div {
          position: relative;
          width: 100%;
          background-image: url('~@/assets/img/vote/BSSVote3/bg-border2.png');
          background-size: 100% 100%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            border: 0.4rem solid transparent;
            border-radius: 0.7rem;
            position: absolute;
            top: 0;
          }
          &:before {
            content: '';
            display: inline-block;
            padding-bottom: 100%;
            width: 0.1px;
            vertical-align: middle;
          }
        }
      }
      .middle {
        vertical-align: top;
        display: inline-block;
        font-size: 0.75rem;
        width: 18%;
        height: 100%;
        position: relative;
        z-index: 3;
        margin: 0 1%;
        img {
          width: 85%;
          margin-left: 8.5%;
          margin-top: 1rem;
          &:first-child {
            padding-top: 1.5rem;
            margin-left: 7.5%;
            margin-top: 0;
          }
        }
        p {
          width: 95%;
          text-align: center;
          margin-left: 2.5%;
          color: #efd153;
          padding-top: 0.5rem;
          padding-bottom: 0.3rem;
          white-space: nowrap;
          overflow: visible;
        }
      }
      .left {
        padding-left: 5%;
      }
      .right {
        padding-right: 5%;
      }
      .pick {
        width: 90%;
        margin-left: 5%;
        margin-top: 1.5rem;
        position: relative;
        overflow: hidden;
        display: inline-block;
        padding-bottom: 1rem;
        z-index: 3;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        div {
          display: inline-block;
          font-size: 0.9rem;
          width: 30%;
          height: 2rem;
          background-image: url('~@/assets/img/vote/BSSVote3/btn-pick.png');
          background-size: 100% 2rem;
          text-align: center;
          line-height: 2rem;
          color: #4c5600;
          font-weight: bold;
          &:first-child {
            margin-left: 5%;
          }
          &:last-child {
            margin-left: 30%;
          }
        }
      }
      .progress {
        width: 90%;
        margin-left: 5%;
        margin-top: 1.4rem;
        position: relative;
        padding-bottom: 0.4rem;
        &.show-in {
          animation: go_in 0.5s;
        }
        .bar {
          display: inline-block;
          height: 0.8rem;
          background-size: 0.8rem 0.8rem;
          background-repeat: repeat;
          margin-top: 0.4rem;
          margin-bottom: 0.5rem;
          &.l {
            width: 45%;
            margin-left: 5%;
            border-radius: 0.4rem 0 0 0.4rem;
            background-color: #ecd338;
          }
          &.r {
            width: 45%;
            border-radius: 0 0.4rem 0.4rem 0;
            background-color: #e86628;
          }
        }
        .left,
        .right {
          font-size: 0.75rem;
          display: inline-block;
          width: 30%;
          height: 1rem;
          font-weight: bold;
          position: relative;
          z-index: 3;
        }
        .left {
          text-align: left;
          color: #ebd439;
        }
        .right {
          margin-left: 40%;
          text-align: right;
          color: #ebd439;
        }
        span {
          display: block;
          width: 0.6rem;
          height: 0.35rem;
          position: absolute;
          top: 1.1rem;
          &.add-one {
            font-size: 0.75rem;
            width: 1rem;
            height: 1rem;
            position: absolute;
            top: -1.3rem;
            font-weight: bold;
            visibility: hidden;
            &.l {
              left: 10%;
              color: #ead620;
              opacity: 0;
              &.l-show {
                animation: add_one 2s;
              }
            }
            &.r {
              right: 10%;
              color: #ead620;
              opacity: 0;
              &.r-show {
                animation: add_one 2s;
              }
            }
          }
        }
      }
    }
  }

  .comment {
    position: relative;
    overflow: hidden;
    .comment-box {
      width: 100%;
      height: 212px;
      position: relative;
      left: 0;
      .baberrage-stage {
        width: 100%;
        position: absolute;
        padding-top: 15px;
        width: 100%;
        height: 212px;
        overflow: hidden;
        top: 0;
        /deep/ .baberrage-item.barrageStyle {
          background-color: #846c08;
          color: #fff;
          border-radius: 100px;
        }
      }
    }
    .send-box {
      width: 90%;
      margin: 0.5rem 5%;
      height: 2.5rem;
      background-color: #fabd0c;
      border-radius: 1.25rem;
      position: relative;
      textarea {
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
          'Segoe UI Symbol', 'Noto Color Emoji';
        border: none;
        outline: none;
        display: block;
        width: 60%;
        height: 1.8rem;
        line-height: 1.8rem;
        font-size: 0.8rem;
        -webkit-border-radius: 0.9rem;
        -moz-border-radius: 0.9rem;
        -ms-border-radius: 0.9rem;
        -o-border-radius: 0.9rem;
        border-radius: 0.9rem;
        padding: 0 0.5rem;
        margin: 0;
        color: #666;
        position: absolute;
        left: 2%;
        top: 0.35rem;
        white-space: nowrap;
        overflow: hidden;
        resize: none;
        &::-webkit-input-placeholder {
          color: #acacac;
        }
      }
      .btn {
        img {
          width: 1.2rem;
          height: 1.2rem;
          position: relative;
          top: 0.2rem;
          margin-right: 0.3rem;
        }
        width: 33%;
        margin-left: 66%;
        height: 2.5rem;
        line-height: 2.5rem;
        color: #5d4401;
        font-size: 1rem;
        font-weight: bold;
        text-align: center;
      }
    }
  }
}
.page-vote,
.page-barrage {
  > img {
    display: block;
    margin: 0 auto;
    padding-top: 1rem;
    width: 95%;
    &.link {
      width: 90%;
      margin: 0.3rem auto 0.8rem;
    }
    &.share {
      width: 90%;
      padding: 1.5rem 0 0.5rem;
    }
  }
  .text {
    display: block;
    &.text1 {
      width: 85%;
    }
    &.text2 {
      width: 70%;
      margin: 1rem auto;
    }
    &.text3 {
      width: 95%;
    }
  }
}
.text4 {
  display: block;
  margin: 1.5rem auto;
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
    height: 14.5rem;
    color: #1b9145;
    position: absolute;
    left: 1rem;
    top: 4rem;
    padding: 0.5rem;
    padding-top: 0;
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
  .share-btn {
    width: 8rem;
    height: 1.8rem;
    text-align: center;
    line-height: 1.8rem;
    color: #fff;
    background-image: url('~@/assets/img/vote/BSSRegister/btn-success.png');
    background-size: 8rem 1.8rem;
    position: absolute;
    left: 4.5rem;
    top: 19.2rem;
    border-radius: 0.2rem;
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
