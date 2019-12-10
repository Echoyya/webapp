<template>
  <div class="wrapper">
    <div class="container">
      <div class="top">
        <img src="@/assets/img/vote/BSSVote2/img-banner.jpg" alt="bg-img" class="bg-img" />
        <div class="tab-box">
          <img src="@/assets/img/vote/BSSVote2/ic-rule.png" @click="showRule" />
          <img src="@/assets/img/vote/BSSVote2/ic-share.png" @click="toShare('upshare')" />
        </div>
      </div>
      <div class="page-control">
        <p :class="pageVote?'active':''" @click="changePage('vote')">KURA</p>
        <p :class="pageVote?'':'active'" @click="changePage('barrage')">MAONI</p>
      </div>
      <div v-if="pageVote" class="page-vote">
        <img class="text text1" src="@/assets/img/vote/BSSVote2/text1.png" alt />
        <div class="date">NOVEMBA 18 - DESEMBA 11</div>
        <div class="vote-box">
          <div class="vote-remaining">
            <div class="remain">KURA ZILIZOBAKI:{{appType==0?0:(voteLeft>0?voteLeft:0)}}</div>
          </div>
          <div v-if="coupleList.length>0">
            <ul class="clearfix">
              <li v-for="(item,key) in coupleList" :key="key" data-id="item.id">
                <div class="item-box">
                  <div>
                    <img :src="item.icon+'?w=150'" class="icon" @click="toPlayer(item,'votepic_click',item.name)" />
                  </div>
                  <span class="name">{{item.name.toUpperCase()}}</span>
                </div>
                <div class="vote-btn">
                  <div class="btn" @click="handleViceVote(item,key)">KURA</div>
                </div>
                <div class="handle-pick-box">
                  <img src="@/assets/img/vote/BSSVote2/ic-pick.png" alt />
                  <div class="title">CHAGUA KURA ZAKO</div>
                  <div class="votes">Kura zilizobaki: {{voteLeft}}</div>
                  <div class="pick">
                    <div class="vote-value" :class="voteLeft>=1?'abled':'disabled'" @click="handleVote(item,1)">+1</div>
                    <div class="vote-value" :class="voteLeft>=5?'abled':'disabled'" @click="handleVote(item,5)">+5</div>
                    <div class="vote-value" :class="voteLeft>=10?'abled':'disabled'" @click="handleVote(item,10)">+10</div>
                  </div>
                  <div class="cancel" @click="closeShadow">GHAIRI</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <img class="text text2" src="@/assets/img/vote/BSSVote2/text2.png" alt />
        <div class="more-vote">
          <div class="vip">
            <!-- APP外、匿名、登录都不是会员 -->
            <img v-if="appType==0||(appType>0&&!isOttVip&&!isLinkVip)" src="@/assets/img/vote/BSSVote2/ic-noOtt-noLink.png" alt />
            <!-- 都是会员 -->
            <img v-if="appType>0&&isOttVip&&isLinkVip" src="@/assets/img/vote/BSSVote2/ic-isOtt-isLink.png" alt />
            <!-- 是OTT 不是LINK -->
            <img v-if="appType>0&&isOttVip&&!isLinkVip" src="@/assets/img/vote/BSSVote2/ic-isOtt-noLink.png" alt />
            <!-- 不是OTT 是LINK -->
            <img v-if="appType>0&&!isOttVip&&isLinkVip" src="@/assets/img/vote/BSSVote2/ic-noOtt-isLink.png" alt />
            <div v-if="appType==0||appType>0&&!isOttVip" class="op open-ott" @click="toVip('ottvip')"></div>
            <div v-if="appType==0||appType>0&&!isLinkVip" class="op open-dvb" @click="toVip('dvbvip')"></div>
          </div>
          <img v-if="appType>0&&isLogin" src="@/assets/img/vote/BSSVote2/ic-2login.png" alt />
          <img v-else src="@/assets/img/vote/BSSVote2/ic-2login-no.png" alt @click="toSignIn" />
          <img src="@/assets/img/vote/BSSVote2/ic-3share.png" alt @click="toShare('invite')" />
          <div class="num">
            <p>FANIKIWA KUALIKA RAFIKI {{share_num}}</p>
          </div>
        </div>
        <img src="@/assets/img/vote/BSSVote2/img-share.png" class="share" @click="toShare('midshare')" />
        <img src="@/assets/img/vote/BSSRegister/ic-link-comment.png" alt class="link" @click="toComment('mid')" />
        <img v-if="appType>0&&!isLogin" class="text text3" src="@/assets/img/vote/BSSVote2/text3-login-no.png" @click="toSignIn" />
        <img v-if="!(appType>0&&!isLogin)" class="text text3" src="@/assets/img/vote/BSSVote2/text3-login.png" alt />
        <div class="lottery-box">
          <div class="lottery">
            <div class="count">NAFASI ZILIZOBAKI:{{appType>0&&isLogin?(lotteryLeft>0?lotteryLeft:0):0}}</div>
            <div class="lottery-type">
              <ul class="clearfix">
                <li v-for="(item,key) in lotteryList" :key="key" :class="indexs==key?'active':''">
                  <div>
                    <div class="prize">
                      <img :src="item.picture_url" alt />
                      <p>{{item.name}}</p>
                    </div>
                  </div>
                </li>
                <div v-if="appType>0&&isLogin&&lotteryLeft>0" class="getLuck" @click="startLottery">Anza</div>
                <div v-else class="getLuck-gray" @click="canNotLottery">Anza</div>
              </ul>
            </div>
            <div class="msg">
              <ul ref="msgul" :class="{anim:animates==true}">
                <img src="@/assets/img/vote/BSSRegister/sound.png" alt />
                <li v-for="item in msgList" :key="item.key">{{item.nick_name?item.nick_name:(item.user_name?item.user_name:item.user_id)}} umeshinda {{item.reward_name||''}}!</li>
              </ul>
            </div>
            <div class="tip">
              <p>TAFUTA ZAWADI KWENYE ME -> KUPONI YANGU</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="page-barrage">
        <div class="topic">
          <img class="title" :src="topic+'?w=350'" alt />
          <div class="pick-box">
            <div class="left">
              <div>
                <img v-if="pageListReady[index]" :src="pageListReady[index].candidates[0].icon+'?w=250'" alt />
              </div>
            </div>
            <div class="middle">
              <img src="@/assets/img/vote/BSSVote2/ic-or.png" alt />
              <img src="@/assets/img/vote/BSSVote2/ic-pick-text.png" alt />
              <p>{{allNum}}</p>
            </div>
            <div class="right">
              <div>
                <img v-if="pageListReady[index]" :src="pageListReady[index].candidates[1].icon+'?w=250'" alt />
              </div>
            </div>
            <div v-show="!picked||appType==0" class="pick">
              <div v-if="pageListReady[index]" class="btn" @click="handlePick('left',pageListReady[index].candidates)">CHAGUA</div>
              <div v-if="pageListReady[index]" class="btn" @click="handlePick('right',pageListReady[index].candidates)">CHAGUA</div>
            </div>
            <div v-show="picked&&appType>0" class="progress" :class="{'show-in':show_in}">
              <div class="bar l"></div>
              <div class="bar r"></div>
              <div class="left">{{leftNum}}%</div>
              <div class="right">{{rightNum}}%</div>
              <span class="add-one l" :class="{'l-show':l_show}">+1</span>
              <span class="add-one r" :class="{'r-show':r_show}">+1</span>
            </div>
          </div>
        </div>
        <div id="comment" class="comment">
          <div class="comment-box">
            <vue-baberrage :isShow="true" :barrageList="barrageList" :loop="false" :throttleGap="1500"></vue-baberrage>
          </div>
          <div class="send-box">
            <textarea v-model="commentText" type="text" placeholder="SHIRIKISHA HISIA YAKO..." maxlength="100" @focus="inputFocus" />
            <div class="btn" @click="sendComment">{{disabled?`${during}s`:`TUMA`}}</div>
          </div>
        </div>
        <img src="@/assets/img/vote/BSSVote2/img-share.png" class="share" @click="toShare('midshare')" />
      </div>
      <img class="text text4" src="@/assets/img/vote/BSSVote2/text4.png" alt />
      <div class="past-programme">
        <ul class="clearfix">
          <li v-for="(item,i) in clipsList" :key="i">
            <div @click="toPlayer(item,'video_click',item.description)">
              <img class="url" :src="item.cover+'?w=230'" />
            </div>
            <p class="title">{{(item.description)}}</p>
          </li>
        </ul>
      </div>
    </div>
    <div v-show="show_rules" class="rules-box">
      <img src="@/assets/img/vote/BSSRegister/bg-rule.png" alt />
      <div class="rule-text">
        Matokeo ya Kura yataamua moja kwa moja safari ya washiriki 20 ambao waliaga mashindano. Watachaguliwa Washiriki 2 kati ya washiriki 16 ambao waliondolewa kwenye mashindano na kurudi kushindana na washiriki 4 wanaokwenda kwenye hatua inayofuata,ambapo watachuana na kubaki washindi 5 watakaokwenda kwenye fainali
        <br />
        <br />1. Muda wa kupiga Kura ni kuanzia saa 12:00 Novemba 18,2019 Mpaka Disemba 11,2019 saa 9:00.
        <br />2. Vigezo vya kupiga kura : Tafuta na pakua APP ya StarTimes ON kwenye simu yako,ingia sehemu ya nafasi ya pili ya Bongo Star Search 2019 na umpigie kura Mshiriki Unayempenda.
        <br />① Watumiaji wa kawaida wanaweza kumpigia kura mshiriki wanaempenda kwa mara 5 kwa siku moja.
        <br />② Wanachama wa VIP(VIP: StarTimes On na watumiaji wa Dikoda watapata kura 50 kwa siku (Mwanachama utapata kura 50 katika siku ya pili inayofuata ukinunua kifurushi)).
        <br />③ Shirikisha marafiki kwa kuwaalika kupakua APP ya StarTimes On na kupata kura 5 kwa kila mtumiaji ambae umempa mualiko na wewe kujipatia kura zaidi.
        <br />④ Upigaji kura utaambatana na utoaji wa zawadi,mshiriki atapata nafasi 5 za kupata zawadi, Kutakua nza zawadi za Sabufa ya Aborder ya shilingi Tsh 85,000. Au Bluetooth ya Aborder ya Tsh 35,000. Na kwa washiriki wa StarTimes On watapata kuponi siku ya pili.
        <br />3. Matokeo ya washiriki waliopigiwa kura yatakua yakitangazwa kabla ya hatua inayofuata na matokeo ya mwisho ya kura yatatangazwa sehemu ya 10.
      </div>
      <div class="share-btn" @click="toShare('voterules')">SHIRIKI</div>
      <img src="@/assets/img/vote/BSSRegister/ic-close.png" alt @click="closeShadow" />
    </div>
    <div v-show="show_rules||show_pick" class="shadow-box" @click="closeShadow"></div>
    <mShare v-if="$appType==0" ref="share" />
    <alert-dialog ref="alert" />
    <confirm-dialog ref="confirm" />
    <toast-dialog ref="toast" />
  </div>
</template>
<script>
import qs from 'qs'
import alertDialog from '@/components/alert'
import confirmDialog from '@/components/confirm'
import toastDialog from '@/components/toast'
import mShare from '@/components/web/share.vue'
import { callApp, downApk, playVodinApp, toNativePage, shareInvite, shareInviteIos, addTicketByDownload, getQuery } from '@/functions/app'
import { vueBaberrage, MESSAGE_TYPE } from 'vue-baberrage'
import env from '@/functions/config'
export default {
  components: {
    mShare,
    alertDialog,
    confirmDialog,
    toastDialog,
    vueBaberrage
  },
  data() {
    return {
      // 页面
      show_rules: false,
      show_pick: false,
      appType: this.$appType,
      isLogin: this.$isLogin,
      // appType: 1,
      // isLogin: true,
      firstTime: true,
      user_id: this.$user.id,
      share_num: 0,
      enroll_id: 2,
      clipsList: [],
      topicList: [],
      pageVote: true,
      isOttVip: false,
      isLinkVip: false,

      // msg: '',
      currentId: 0,
      i: 0,
      barrageList: [],
      t: null,
      maxTime: 5,
      minTime: 3,

      // 投票
      voteLeft: 0,
      loaded: false,
      advisorList: [],
      vote_id: 64,
      startTime: new Date('2019-11-18T09:00:00'.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime(),
      endTime: new Date('2019-12-11T06:00:00'.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime(),
      endTime2: new Date('2019-12-21T09:00:00'.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime(),
      canVotes: true,

      // 抽奖
      indexs: -1, // 当前转动到哪个位置，起点位置
      counts: 8, // 总共有多少个位置
      timers: 0, // 每次转动定时器
      speeds: 200, // 初始转动速度
      times: 0, // 转动次数
      cycle: 30, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
      prize: -1, // 中奖位置
      click: true,

      lotteryLeft: 0,
      lottery_id: 3,
      lotteryType: [],
      loaded_l: false,

      // 消息轮播
      animates: false,
      items: [],
      star: '',
      loaded_m: false,
      tmsg: null,
      tscroll: null,

      // 弹幕
      barrage_id: 17,
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
      loaded_page: false,
      loaded_comment: false,
      number: 20, // 每次请求的弹幕数量
      last_id: 0, // 上一次请求的最后一条弹幕id
      canClickTab1: false,
      canClickTab2: false,

      imgUrl: 'http://cdn.startimestv.com/banner/BSSVote2-banner.png',
      shareTitle: 'Bongo Star Search 2019',
      shareText: 'Saidia mshiriki wako unayempenda kurudi kwenye show!'
    }
  },
  computed: {
    pageListReady() {
      if (this.loaded_page) {
        return this.pageList
      } else {
        return []
      }
    },
    coupleList() {
      if (this.loaded) {
        return this.advisorList
      } else {
        return []
      }
    },
    lotteryList() {
      if (this.loaded_l) {
        return this.lotteryType
      } else {
        return []
      }
    },
    msgList() {
      if (this.loaded_l && this.loaded_m) {
        return this.items
      } else {
        return []
      }
    },
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
    this.vote_id = getQuery('voteid') || 64
    this.barrage_id = getQuery('barrageid') || 17
  },
  mounted() {
    this.barrageBox = document.getElementsByClassName('baberrage-stage')
    this.mSendEvLog('page_show', '', '')
    this.getAdvisorList()
    this.getVoteRemain()
    this.getLeftLottery()
    this.getVideoMsg()
    this.getLotteryType()
    this.getShareNum()
    this.msgScroll()
  },

  methods: {
    addToList(v) {
      let time = 75 / (10 + decodeURI(v.content).length * 0.5)
      if (time > this.maxTime) time = this.maxTime
      if (time < this.minTime) time = this.minTime
      this.barrageList.push({
        id: ++this.currentId,
        avatar: v.avatar
          ? v.avatar == 'http://cdn.startimestv.com/head/h_d.png' ? 'http://cdn.startimestv.com/banner/DD_user_icon.png' : v.avatar
          : 'http://cdn.startimestv.com/banner/DD_user_icon.png',
        msg: decodeURI(v.content),
        time: time,
        type: MESSAGE_TYPE.NORMAL
      })
    },
    msgScroll() {
      this.tmsg = setInterval(() => {
        if (this.$serverTime > this.endTime) clearInterval(this.tmsg)
        this.getMsgList()
      }, 60000)
      const msgul = this.$refs.msgul
      this.tscroll = setInterval(() => {
        msgul.style.marginTop = '-30px'
        this.animates = !this.animates
        setTimeout(() => {
          this.msgList.push(this.msgList[0])
          this.msgList.shift()
          msgul.style.marginTop = '0'
          this.animates = !this.animates // 避免回滚
        }, 500)
      }, 2000)
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
        this.$nextTick(() => {
          this.msgScroll()
        })
      } else if (page == 'barrage') {
        if (!this.canClickTab2) {
          return
        }
        this.mSendEvLog('tab_click', 'interact', '')
        this.canClickTab2 = false
        this.pageVote = false
        clearInterval(this.tmsg)
        clearInterval(this.tscroll)
        if (this.firstTime) {
          this.firstTime = false
          this.getPagelist()
        } else {
          this.$nextTick(() => {
            this.initPage()
          })
          this.barrageIsShow = true
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
      // pageList数据
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
        this.leftNum = parseInt(this.leftNumVal / this.allNum * 100)
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
      document.getElementById('comment').scrollIntoView()
    },
    getIndexToIns(arr, num) {
      const index = arr.sort((a, b) => a - b).findIndex(currentPage => num <= currentPage)
      return index <= 0 ? 1 : index
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
            this.loaded_page = true
            this.initPage()
            this.loaded_comment = false
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
        this.loaded_comment = true
        this.canClickTab1 = true
        return
      }
      this.$axios
        .get(`/voting/v1/comments?comment_activity_id=${this.index + 13}&last_id=${this.last_id}&num_per_page=${this.number}`)
        .then(res => {
          if (res.data.code === 0) {
            this.last_id = res.data.data[res.data.data.length - 1].id
            this.commentList = res.data.data
            this.canClickTab1 = true
            this.i = 0
            this.t = setInterval(() => {
              this.addToList(this.commentList[this.i])
              this.i++
              for (let j = 0; j < this.barrageBox[0].childNodes.length; j++) {
                if (this.barrageBox[0].childNodes[j].nodeName == 'DIV') {
                  this.barrageBox[0].childNodes[j].style.backgroundColor = '#848d34'
                  this.barrageBox[0].childNodes[j].style.borderRadius = '100px'
                  this.barrageBox[0].childNodes[j].style.color = '#fff'
                }
              }
              if (this.i >= this.number) {
                this.i = 0
                clearInterval(this.t)
                this.barrageList = []
                this.getCommentList()
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
          'Upigaji kura utaanza tarehe 18th Novemba, kwa hiyo kaa tayari!',
          () => {
            this.canVote = true
          },
          'SAWA'
        )
        return
      }
      // 活动已结束提示
      if (this.$serverTime >= this.endTime2) {
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
            this.leftNum = parseInt(this.leftNumVal / this.allNum * 100)
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

            // domLeft.style.width = 0.9 * this.leftNum + '%'
            // domRight.style.width = 0.9 * this.rightNum + '%'
            let w = 0
            if (local == 'left') {
              domLeft.style.width = 0
              domRight.style.width = 90 + '%'
              const t = setInterval(() => {
                if (w == this.leftNum) {
                  clearInterval(t)
                  domLeft.style.width = 0.9 * this.leftNum + '%'
                  domRight.style.width = 0.9 * this.rightNum + '%'
                } else {
                  domLeft.style.width = 0.9 * w + '%'
                  domRight.style.width = 0.9 * (100 - w) + '%'
                  w = w + 1
                  if (this.leftNum == 100) {
                    domLeft.style.borderRadius = '0.4rem'
                  } else if (this.rightNum == 100) {
                    domRight.style.borderRadius = '0.4rem'
                  } else {
                    domLeft.style.borderRadius = '0.4rem 0 0 0.4rem'
                    domRight.style.borderRadius = '0 0.4rem 0.4rem 0'
                  }
                }
              }, (100 - this.leftNum) / 5)
            } else {
              domLeft.style.width = 90 + '%'
              domRight.style.width = 0
              const t = setInterval(() => {
                if (w == this.rightNum) {
                  clearInterval(t)
                  domLeft.style.width = 0.9 * this.leftNum + '%'
                  domRight.style.width = 0.9 * this.rightNum + '%'
                } else {
                  domLeft.style.width = 0.9 * (100 - w) + '%'
                  domRight.style.width = 0.9 * w + '%'
                  w = w + 1
                  if (this.leftNum == 100) {
                    domLeft.style.borderRadius = '0.4rem'
                  } else if (this.rightNum == 100) {
                    domRight.style.borderRadius = '0.4rem'
                  } else {
                    domLeft.style.borderRadius = '0.4rem 0 0 0.4rem'
                    domRight.style.borderRadius = '0 0.4rem 0.4rem 0'
                  }
                }
              }, (100 - this.rightNum) / 5)
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
        this.$refs.alert.show('Upigaji kura utaanza tarehe 18th Novemba, kwa hiyo kaa tayari!', () => {}, 'SAWA')
        this.commentText = ''
        this.disabled = false
        this.canClickTab1 = true
        return
      }
      // 活动已结束提示
      if (this.$serverTime >= this.endTime2) {
        this.commentText = ''
        this.$refs.alert.show(
          'Samahani, kura zimekwisha.',
          () => {
            this.disabled = false
            this.canClickTab1 = true
          },
          'SAWA'
        )
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
            'GOT IT'
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
          comment_activity_id: this.index + 13,
          content: encodeURI(this.commentText)
        })
      })
        .then(res => {
          if (res.data.code === 0) {
            this.mSendEvLog('send_click', this.commentText, '')
            const during = this.during
            this.addToList({
              id: this.currentId++,
              avatar: this.$user.head || 'http://cdn.startimestv.com/banner/DD_user_icon.png',
              content: this.commentText
            })
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
          window.bridge.startLogin()
        } else if (this.isLogin) {
          if (vip == 'dvbvip') {
            // 原生DVB
            this.mSendEvLog('dvb_click', '', '')
            window.bridge.toAppPage('dvbLink', "{'isBackToSource':false}")
          } else if (vip == 'ottvip') {
            // 原生OTT
            this.mSendEvLog('ott_click', '', '')
            window.location.href = 'startimes://ottProduct?tab=all'
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
    },
    toComment(label) {
      this.mSendEvLog('audreg_click', label, '')
      // window.location.href = 'http://m.startimestv.com/hybrid/vote/BSSComment'
      window.location.href = 'http://qa.upms.startimestv.com/hybrid/vote/BSSComment'
    },
    // 埋点方法
    mSendEvLog(action, label, value) {
      this.$sendEvLog({
        category: 'form_BSSVote2_' + this.platform,
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
        window.bridge.startLogin()
      }
    },
    // 调出分享弹层(app/web)
    toShare(label) {
      if (label == 'voterules') this.closeShadow()
      this.mSendEvLog('share_click', label, '')
      const url =
        window.location.href.indexOf('?') >= 0
          ? window.location.href + (this.isLogin ? '&pin=' + this.$user.id : '') + '&utm_source=VOTE&utm_medium=BSS&utm_campaign=' + this.platform
          : window.location.href + (this.isLogin ? '?pin=' + this.$user.id : '') + '&utm_source=VOTE&utm_medium=BSS&utm_campaign=' + this.platform
      if (this.appType == 1) {
        shareInvite(url, this.shareTitle, this.shareText, this.imgUrl)
      } else if (this.appType == 0) {
        this.$refs.share.show()
      } else {
        shareInviteIos(url, this.shareTitle, this.shareText, this.imgUrl)
      }
    },
    // 唤醒转入活动页或下载App
    callOrDownApp(label) {
      // 唤醒App
      callApp.call(this, 'com.star.mobile.video.activity.BrowserActivity?loadUrl=' + window.location.href, () => {
        // 下载App
        this.mSendEvLog('downloadpopup_show', label, '')
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
            this.voteLeft = 0 // 服务器端计算数据错误时
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
          this.loaded = true
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
    handleViceVote(advisor, key) {
      if (!this.canVotes) {
        return
      }
      if (this.appType == 0) {
        this.mSendEvLog('votebtn_click', advisor.name, '')
        this.callOrDownApp('vote')
        return
      }
      if (this.$serverTime < this.startTime) {
        this.mSendEvLog('votebtn_click', advisor.name, '')
        this.$refs.alert.show('Upigaji kura utaanza tarehe 18th Novemba, kwa hiyo kaa tayari!', () => {}, 'SAWA')
        return
      } else if (this.$serverTime > this.endTime) {
        this.mSendEvLog('votebtn_click', advisor.name, '')
        this.$refs.alert.show('Samahani, kura zimekwisha.', () => {}, 'SAWA')
        return
      }
      if (this.voteLeft <= 0) {
        this.mSendEvLog('votebtn_click', advisor.name, '')
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
        this.mSendEvLog('votebtn_click', advisor.name, '')
        const box = document.getElementsByClassName('handle-pick-box')[key]
        box.style.display = 'block'
        this.show_pick = true
      }
    },
    closeShadow() {
      document.body.style.overflow = 'auto'
      document.body.style.position = 'static'
      let box = document.getElementsByClassName('handle-pick-box')
      box = Array.prototype.slice.call(box)
      box.forEach(item => {
        item.style.display = 'none'
      })
      this.show_rules = false
      this.show_pick = false
    },
    // 投票1，5，10
    handleVote(advisor, value) {
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
          candidate_id: advisor.id,
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
            if (this.voteLeft > 0) {
              this.$refs.toast.show('Upigaji umefanikiwa! Umepata nafasi ya kupata zawadi kwa kupitia mchezo wa ukurasa huu.')
            } else {
              this.$refs.confirm.show(
                'Upigaji umefanikiwa! Shirikisha marafiki kupata kura zaidi.',
                () => {
                  this.toShare('0leftvote')
                },
                () => {},
                'SHIRIKI',
                'FUTA'
              )
            }
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
              this.lotteryLeft = 0 // 服务器端计算数据错误时
              this.$refs.alert.show('Get lottery chance error!')
            }
          })
          .catch(err => {
            this.lotteryLeft = 0
            this.$refs.alert.show('Get lottery chance error!! ' + err)
          })
      }
    },
    // 获取抽奖种类
    getLotteryType() {
      this.$axios
        .get(`/voting/lottery/v1/rewards?lottery_id=${this.lottery_id}`)
        .then(res => {
          if (res.data.code === 0) {
            this.lotteryType = res.data.data
          } else {
            this.lotteryType = [] // 服务器端计算数据错误时
            this.$refs.alert.show('Get rewards error!')
          }
          this.loaded_l = true
          this.getMsgList()
        })
        .catch(err => {
          this.lotteryType = []
          this.$refs.alert.show('Get rewards error!! ' + err)
        })
    },
    // 获取消息列表
    getMsgList() {
      this.$axios
        .get(`/voting/lottery/v1/winnings?lottery_id=${this.lottery_id}`)
        .then(res => {
          if (res.data.code === 0) {
            if (this.$serverTime <= this.startTime) {
              this.items = []
            } else {
              this.items = res.data.data
              this.items.forEach(item => {
                if (item.user_name) {
                  if (new RegExp(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/).test(item.user_name)) {
                    // 邮箱用户
                    const arr = item.user_name.split('@')
                    if (arr[0].length > 3) {
                      item.user_name =
                        arr[0].substr(0, 2) + arr[0].slice(2, -1).replace(/[^\s]/g, '*') + arr[0].substring(arr[0].length - 1) + '@' + arr[1]
                    }
                    if (arr[0].length == 3) {
                      item.user_name = arr[0].replace(/(\w{1})\w{1}(\w{1})/, '$1*$2') + '@' + arr[1]
                    }
                    if (arr[0].length == 2) {
                      item.user_name = arr[0].replace(/\w{1}(\w{1})/, '*$1') + '@' + arr[1]
                    }
                    if (arr[0].length == 1) {
                      item.user_name = arr[0].replace(/\w{1}/, '*') + '@' + arr[1]
                    }
                  } else if (new RegExp(/^\d{1,}$/).test(item.user_name)) {
                    // 手机用户
                    item.user_name = item.user_name.toString().replace(/(.*)\d{3}(\d{3})/, '$1***$2')
                  }
                }
                item.user_id = item.user_id ? item.user_id.toString().replace(/(.*)\d{2}/, '$1**') : 9999
                for (let i = 0; i < this.lotteryType.length; i++) {
                  if (item.reward_id == this.lotteryType[i].id) {
                    item.reward_name = this.lotteryType[i].name
                  }
                }
              })
              this.loaded_m = true
            }
          } else {
            this.items = [] // 服务器端计算数据错误时
            this.$refs.alert.show('Get winnings error!')
          }
        })
        .catch(err => {
          this.items = []
          this.$refs.alert.show('Get winnings error!! ' + err)
        })
    },
    // 抽奖按钮为灰提示
    canNotLottery() {
      if (!this.click) {
        return
      }
      this.mSendEvLog('lottery_click', '', '-1')
      if (this.appType == 0) {
        this.callOrDownApp('lottery')
        return
      }
      if (!this.isLogin) {
        // 移动端未登录
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
        this.$refs.alert.show('Upigaji kura utaanza tarehe 18th Novemba, kwa hiyo kaa tayari!', () => {}, 'SAWA')
        return
      }
      if (this.$serverTime >= this.endTime) {
        this.$refs.alert.show('Samahani, kura zimekwisha.', () => {}, 'SAWA')
        return
      }
      // 票不够不能抽奖
      this.$refs.alert.show('Piga kura ili upate nafasi ya kupata zawadi! Kila kura 5 kwa mchezo 1', () => {}, 'SAWA')
    },
    // 开始抽奖
    startLottery() {
      if (!this.click) {
        return
      }
      this.lotteryLeft--
      this.speeds = 200
      this.click = false
      this.canClickTab2 = false
      this.startRoll()
    },
    // 开始转动
    startRoll() {
      this.times += 1 // 转动次数
      this.oneRoll() // 转动过程调用的每一次转动方法，这里是第一次调用初始化

      // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
      if (this.times > this.cycle + 10 && this.prize === this.indexs) {
        clearTimeout(this.timers) // 清除转动定时器，停止转动
        // this.prize = -1
        this.times = 0
        if (this.indexs < 5) {
          setTimeout(() => {
            this.$refs.alert.show(
              'Hongera! Umepata ' + this.lotteryType[this.indexs].name + '! Zawadi zitatolewa kwenye siku ya pili ya kazi katika Me-> Kuponi zangu.',
              () => {
                this.click = true
                this.canClickTab2 = true
              },
              'SAWA'
            )
          }, 1000)
        } else if (this.indexs == 5) {
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
        } else if (this.indexs === 6) {
          setTimeout(() => {
            this.lotteryLeft++
            this.$refs.alert.show(
              'Hongera! Umepata nafasi moja zaidi!',
              () => {
                this.click = true
                this.startLottery()
              },
              'SAWA'
            )
          }, 1000)
        } else if (this.indexs === 7) {
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
      } else {
        if (this.times < this.cycle) {
          this.speeds -= 10 // 加快转动速度
        } else if (this.times === this.cycle) {
          // 后台取得一个中奖位置
          this.$axios({
            method: 'POST',
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
              // token: this.$store.state.token
            },
            data: qs.stringify({
              lottery_id: this.lottery_id
            }),
            url: '/voting/lottery/v1/drawing'
          })
            .then(res => {
              if (res.data.code == 0) {
                const prizeNum = res.data.data
                for (let i = 0; i < this.lotteryType.length; i++) {
                  if (prizeNum == this.lotteryType[i].id) {
                    this.prize = i
                  }
                }
                if (this.prize + 1 == 3) this.mSendEvLog('lottery_click', 'vip', '1')
                else if (this.prize + 1 == 4) this.mSendEvLog('lottery_click', '40offcoupon', '1')
                else if (this.prize + 1 == 5) this.mSendEvLog('lottery_click', '30offcoupon', '1')
                else if (this.prize + 1 == 6) this.mSendEvLog('lottery_click', 'morevotes', '1')
                else if (this.prize + 1 == 7) this.mSendEvLog('lottery_click', 'tryagain', '0')
                else if (this.prize + 1 == 8) this.mSendEvLog('lottery_click', 'sorry', '0')
              } else {
                setTimeout(() => {
                  clearTimeout(this.timers)
                  this.times = 0
                  this.$refs.alert.show(
                    'Lottery error!',
                    () => {
                      this.lotteryLeft = 0
                    },
                    'SAWA'
                  )
                }, 3000)
              }
            })
            .catch(err => {
              clearTimeout(this.timers)
              this.times = 0
              this.$refs.alert.show('Lottery error!!' + err, () => {
                this.lotteryLeft = 0
              })
            })
        } else if (this.times > this.cycle + 10 && ((this.prize === 0 && this.indexs === 5) || this.prize === this.indexs + 1)) {
          this.speeds += 110
        } else {
          this.speeds += 20
        }

        if (this.speeds < 80) {
          this.speeds = 80
        }
        this.timers = setTimeout(this.startRoll, this.speeds)
      }
    },
    // 每一次转动
    oneRoll() {
      let indexs = this.indexs // 当前转动到哪个位置
      const counts = this.counts // 总共有多少个位置
      indexs += 1
      if (indexs > counts - 1) {
        indexs = 0
      }
      this.indexs = indexs
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
          user_id: this.user_id
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
      // 获取投票单元数据
      this.$axios
        .get(`/voting/v1/program?vote_id=${this.vote_id}`)
        .then(res => {
          if (res.data.code === 0) {
            res.data.data.forEach(item => {
              if (item.name.substr(0, 5) == 'fuhuo') {
                this.clipsList.push(item)
              } else if (item.name.substr(0, 5) == 'topic') {
                this.topicList.push(item)
              }
            })
            this.clipsList.forEach(item => {
              this.mSendEvLog('video_show', item.description, '')
            })
            this.canClickTab2 = true
            if (this.$serverTime > this.endTime) {
              this.changePage('barrage')
            }
          } else {
            this.$refs.alert.show('Get program error!')
          }
        })
        .catch(err => {
          this.$refs.alert.show('Get program error!!' + err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/vote/normal.less';

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
  img,
  div,
  li {
    box-sizing: border-box;
  }

  background-image: url('~@/assets/img/vote/BSSVote2/bg-img.jpg');
  background-size: contain;
  background-repeat: repeat-y;
  font-size: 0.9rem;
  letter-spacing: -0.03rem;
  position: static;
  min-height: 50rem;
  .container {
    position: relative;
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
      border-top: 0.1rem solid #def004;
      border-bottom: 0.1rem solid #def004;
      font-size: 0;
      position: relative;
      margin: 1rem auto;
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
          color: #def004;
          &::before,
          &::after {
            content: '';
            display: block;
            width: 0.3rem;
            height: 0.3rem;
            background-color: #def004;
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
        color: #def004;
        text-align: center;
        height: 2rem;
        line-height: 1.5rem;
        font-size: 0.75rem;
        padding-top: 0.5rem;
      }
      .vote-box {
        width: 95%;
        height: auto;
        background-color: rgba(48, 133, 39, 0.64);
        border-radius: 0.2rem;
        margin: 0.5rem auto 0;
        padding: 1rem 0;
        position: relative;
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
            background-color: #135702;
            &.remain {
              margin: 0 auto;
              width: 12rem;
              color: #00b600;
            }
          }
        }
        ul {
          width: 100%;
          height: auto;
          padding: 0 0.5% 0 1.3%;
          position: relative;
          li {
            list-style: none;
            width: 30.5%;
            float: left;
            margin: 0 1% 1.3rem;
            .item-box {
              position: relative;
              width: 100%;
              div {
                position: relative;
                width: 95%;
                border-radius: 50%;
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
              width: 100%;
              height: 1.3rem;
              margin: 0.2rem 0 0;
              .btn {
                width: 4.5rem;
                height: 1.3rem;
                line-height: 1.3rem;
                color: #ffffff;
                background-image: url('~@/assets/img/vote/BSSRegister/bg-vote.png');
                background-size: 4.5rem 1.3rem;
                margin: 0 auto;
                text-align: center;
                font-size: 0.8rem;
                &:active {
                  width: 4.3rem;
                  height: 1.1rem;
                  line-height: 1.1rem;
                  font-size: 0.75rem;
                  background-size: 4.3rem 1.1rem;
                  margin-top: 0.1rem;
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
              display: none;
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
                  margin-left: 5%;
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
          }
        }
      }
      .more-vote {
        width: 95%;
        margin: 1rem auto;
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
            background-color: transparent;
            overflow: hidden;
            height: 0;
            &.open-ott {
              padding-bottom: 7%;
              top: 37.5%;
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
      .lottery-box {
        width: 100%;
        height: 27rem;
        margin-top: 1rem;
        .lottery {
          width: 90%;
          height: 27rem;
          background-color: #fea42f;
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
            background-color: #ff6d21;
            text-align: center;
            margin: 0 auto 0.5rem;
            font-size: 0.75rem;
          }
          .lottery-type {
            width: 100%;
            margin: 0 auto;
            background-image: url('~@/assets/img/vote/BSSRegister/bg-border.png');
            background-size: 100% 19.5rem;
            color: #ad5500;
            ul {
              width: 90%;
              margin: 0 auto;
              border-radius: 0.5rem;
              padding: 0.2rem 0;
              position: relative;
              height: 19.5rem;
              li {
                width: 30%;
                height: 5rem;
                display: block;
                position: absolute;
                overflow: hidden;
                border-radius: 0.2rem;
                background-color: #fff;
                border: 0.25rem solid transparent;
                &:nth-child(1) {
                  background-image: url('~@/assets/img/vote/BSSRegister/bg-lottery-light.png');
                  background-size: 100% 100%;
                  border-top-left-radius: 1rem;
                  left: 3%;
                  top: 1.7rem;
                }
                &:nth-child(2) {
                  background-image: url('~@/assets/img/vote/BSSRegister/bg-lottery-light.png');
                  background-size: 100% 100%;
                  left: 35%;
                  top: 1.7rem;
                }
                &:nth-child(3) {
                  border-top-right-radius: 1rem;
                  left: 67%;
                  top: 1.7rem;
                }
                &:nth-child(4) {
                  left: 67%;
                  top: 7.2rem;
                }
                &:nth-child(5) {
                  border-bottom-right-radius: 1rem;
                  left: 67%;
                  top: 12.7rem;
                }
                &:nth-child(6) {
                  left: 35%;
                  top: 12.7rem;
                }
                &:nth-child(7) {
                  border-bottom-left-radius: 1rem;
                  left: 3%;
                  top: 12.7rem;
                }
                &:nth-child(8) {
                  left: 3%;
                  top: 7.2rem;
                }
                &.active {
                  border: 0.25rem solid #8cd021;
                }
                > div {
                  width: 100%;
                  height: 5.5rem;
                  padding: 0 0.2rem;
                  .prize {
                    img {
                      display: block;
                      width: auto;
                      height: 2.2rem;
                      margin: 0 auto;
                      padding: 0.3rem 0;
                    }
                    p {
                      display: block;
                      width: 100%;
                      text-align: center;
                      font-size: 0.75rem;
                      display: -webkit-box;
                      -webkit-box-orient: vertical;
                      -webkit-line-clamp: 2;
                      overflow: hidden;
                    }
                  }
                }
              }
              .getLuck,
              .getLuck-gray {
                width: 32%;
                height: 5.3rem;
                border-radius: 0.2rem;
                text-align: center;
                position: absolute;
                top: 7.2rem;
                left: 34%;
                background-size: 100% 5.3rem;
                font-size: 1.3rem;
                font-weight: bold;
                line-height: 4.5rem;
              }
              .getLuck {
                background-image: url('~@/assets/img/vote/BSSRegister/start.png');
                &:active {
                  background-image: url('~@/assets/img/vote/BSSRegister/start-ac.png');
                }
              }
              .getLuck-gray {
                background-image: url('~@/assets/img/vote/BSSRegister/start-gray.png');
                color: #ccc;
              }
            }
          }
          .msg {
            width: 100%;
            height: 2rem;
            line-height: 2rem;
            overflow: hidden;
            transition: all 0.5s;
            position: relative;
            margin-bottom: 0.3rem;
            background-color: #c86a02;
            border-radius: 1rem;
            .anim {
              transition: all 0.5s;
            }
            img {
              position: absolute;
              display: block;
              width: 1.23rem;
              height: 1rem;
              left: 0.8rem;
              top: 0.5rem;
            }
            ul {
              width: 100%;
              li {
                width: 100%;
                padding-left: 2.5rem;
                line-height: 2rem;
                height: 2rem;
                color: #fde8ae;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          .tip {
            width: 100%;
            height: 1.3rem;
            font-size: 0.75rem;
            line-height: 1.3rem;
            text-align: center;
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
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
              background-image: url('~@/assets/img/vote/BSSVote2/bg-border.png');
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
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -moz-user-select: none; /*火狐*/
            -webkit-user-select: none; /*webkit浏览器*/
            -ms-user-select: none; /*IE10*/
            -khtml-user-select: none; /*早期浏览器*/
            user-select: none;
            div {
              display: inline-block;
              font-size: 0.9rem;
              width: 30%;
              height: 2rem;
              background-image: url('~@/assets/img/vote/BSSVote2/btn-pick.png');
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
          width: 135%;
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
          }
        }
        .send-box {
          width: 90%;
          margin: 0.5rem 5%;
          height: 2.5rem;
          background-color: #b8c104;
          border-radius: 1.25rem;
          position: relative;
          textarea {
            font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
              'Segoe UI Symbol', 'Noto Color Emoji';
            border: none;
            outline: none;
            display: block;
            width: 70%;
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
            overflow-x: auto;
            resize: none;
            &::-webkit-input-placeholder {
              color: #acacac;
            }
          }
          .btn {
            display: block;
            width: 25%;
            margin-left: 75%;
            height: 2.5rem;
            line-height: 2.5rem;
            color: #616a00;
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
        height: auto;
        &.link {
          width: 90%;
          margin: 0.3rem auto 0.8rem;
        }
        &.share {
          width: 90%;
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
      overflow-x: hidden;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
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
}
</style>
