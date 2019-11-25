<template>
  <div class="wrapper">
    <mBanner />
    <countdown :teamNo="teamNum" :activityStart="activityStart" :activityEnd="activityEnd" :isFull="isFull" />
    <div v-if="team.length>0 || hasFinish" class="team-normal">
      <div v-show="!show_share" class="invite box">
        <div v-if="!hasFinish" class="title">{{$t('vote.team.invite_tips')}}</div>
        <div v-if="!hasFinish" class="contant">
          <div>
            <div>
              <img :src="team[0].logo" />
            </div>
            <span>{{team[0].nick_name}}</span>
          </div>
          <img src="@/assets/img/vote/TeamFission/ic_forward2.png" />
          <div>
            <div>
              <img v-if="team[1]" :src="team[1].logo" />
              <img v-else src="@/assets/img/vote/TeamFission/bg-add.png" />
            </div>
          </div>
          <div>
            <div>
              <img v-if="team[2]" :src="team[2].logo" />
              <img v-else src="@/assets/img/vote/TeamFission/bg-add.png" />
            </div>
          </div>
        </div>
        <div v-if="hasFinish" class="finish">
          {{$t('vote.team.share10_1')}}
          <br />
          {{$t('vote.team.share10_2')}}
        </div>
        <div class="friends-box clearfix" :class="hasFinish?'finished':'normal'">
          <div class="img" @click="toSearch"></div>
          <div class="friends" @click="showShare">
            <img src="@/assets/img/vote/TeamFission/ic_share.png" />
            <p v-if="$isLogin">{{$t('vote.team.invite_btn')}}</p>
            <p v-else>{{$t('vote.team.invite_btn2')}}</p>
          </div>
        </div>
      </div>
      <div v-show="show_share" class="share-box">
        <img src="@/assets/img/vote/TeamFission/ic_close.png" @click="show_share=false" />
        <img src="@/assets/img/vote/TeamFission/ic-facebook.png" @click="toFacebook" />
        <img src="@/assets/img/vote/TeamFission/ic_WhatsApp.png" @click="toWhatsApp" />
        <img src="@/assets/img/vote/TeamFission/ic_xender.png" @click="toXender" />
        <img src="@/assets/img/vote/TeamFission/ic_download.png" @click="toDownload" />
        <img src="@/assets/img/vote/TeamFission/ic-copylink.png" @click="toCopylink" />
        <div>
          <span>{{$t('vote.team.facebook')}}</span>
          <span>{{$t('vote.team.whatsapp')}}</span>
          <span>{{$t('vote.team.xender')}}</span>
          <span>{{$t('vote.team.download')}}</span>
          <span>{{$t('vote.team.copy')}}</span>
        </div>
      </div>
      <div class="lottery box">
        <div class="title">{{$t('vote.team.draw_title')}}</div>
        <div class="contant">
          <div class="lottery-type">
            <ul class="clearfix">
              <li v-for="(item,key) in lotteryList" :key="key" :class="indexs==key?'active':''">
                <div>
                  <div class="prize">
                    <img :src="item.picture_url" alt />
                  </div>
                </div>
              </li>
              <div class="getLuck" @click="startLottery">{{$t('vote.team.draw_button')}}</div>
            </ul>
          </div>
        </div>
      </div>
      <div class="msg-box">
        <div class="msg">
          <ul ref="msgul" :class="{anim:animates==true}">
            <img src="@/assets/img/vote/TeamFission/ic-msg.png" alt />
            <li
              v-for="item in msgList"
              :key="item.key"
            >{{item.nick_name?item.nick_name:(item.user_name?item.user_name:item.user_id)}} has won {{item.reward_name||''}}!</li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="isFull" class="team-full">
      <div class="text text1">{{$t('vote.team.full_team')}}</div>
      <div class="invite">
        <div v-show="mumberList.length>0" class="team clearfix">
          <div v-for="(item,index) in mumberList" :key="index" class="mumber">
            <div>
              <img v-if="item.logo" :src="item.logo" />
              <img v-else src="https://cdn.startimestv.com/head/h_d.png" />
            </div>
          </div>
          <div v-for="(add) in (3-mumberList.length)" :key="add+3" class="mumber">
            <span class="add">
              <img src="@/assets/img/vote/TeamFission/bg-add.png" />
            </span>
          </div>
        </div>
        <span>{{$t('vote.team.invite_won',[number])}}</span>
        <div class="team-btn">
          <div @click="toCreateFull()">{{$t('vote.team.form_newbtn')}}</div>
        </div>
      </div>
      <div v-show="moreList1.length>0" class="text text2">{{$t('vote.team.follow_team')}}</div>
      <div class="more-team">
        <div v-show="moreList1.length>0" class="team1 clearfix">
          <div class="team-id">{{$t('vote.team.team_id')}}: {{teamNum1}}</div>
          <div class="team-box">
            <div class="team clearfix">
              <div v-for="(item,index) in moreList1" :key="index" class="mumber">
                <img v-if="item.logo" :src="item.logo" />
                <img v-else src="https://cdn.startimestv.com/head/h_d.png" />
              </div>
              <div v-for="(add) in (3-moreList1.length)" :key="add+3" class="mumber">
                <span class="add">
                  <img src="@/assets/img/vote/TeamFission/bg-add.png" />
                </span>
              </div>
            </div>
            <div class="join">
              <div @click="toJoinFull(teamNum1)">{{$t('vote.team.join_s')}}</div>
            </div>
          </div>
        </div>
        <div v-show="moreList1.length>0&&moreList2.length>0" class="team2 clearfix">
          <div class="team-id">{{$t('vote.team.team_id')}}: {{teamNum2}}</div>
          <div class="team-box">
            <div class="team clearfix">
              <div v-for="(item,index) in moreList2" :key="index" class="mumber">
                <img v-if="item.logo" :src="item.logo" />
                <img v-else src="https://cdn.startimestv.com/head/h_d.png" />
              </div>
              <div v-for="(add) in (3-moreList2.length)" :key="add+3" class="mumber">
                <span class="add">
                  <img src="@/assets/img/vote/TeamFission/bg-add.png" />
                </span>
              </div>
            </div>
            <div class="join">
              <div @click="toJoinFull(teamNum2)">{{$t('vote.team.join_s')}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <malert ref="malert" />
    <chooseMethod ref="confirm" />
    <uncloseAlert ref="findTeamAlert">
      <div slot="link" @click="changeTeam">CHANGE</div>
    </uncloseAlert>
  </div>
</template>
<script>
import mBanner from '@/pages/activity/team/banner.vue'
import { formatAmount } from '@/functions/utils'
import { searchTeam, joinTeam, createTeam, searchMyTeam } from '@/pages/activity/team/func'
import { shareByFacebook, shareByWhatsApp, shareByXender, shareByCopyLink, getQuery, toNativePage, shareInvite, toNativeLogin } from '@/functions/app'
import malert from '@/pages/activity/team/malert'
import uncloseAlert from '@/pages/activity/team/uncloseAlert'
import countdown from '@/pages/activity/team/countdown'
import chooseMethod from '@/pages/activity/team/confirm'
export default {
  components: {
    mBanner,
    malert,
    uncloseAlert,
    countdown,
    chooseMethod
  },
  data() {
    return {
      activity_id: getQuery('activity') || 1,
      activityStart: 0,
      activityEnd: 0,
      imgUrl: 'http://cdn.startimestv.com/banner/BSSVote2-banner.png',
      shareTitle: this.$t('vote.team.shareTitle'),
      shareText: this.$t('vote.team.shareText'),

      show_share: false,
      hasFinish: false,

      //team
      team: [],
      teamNum: '',

      isFull: false,
      mumberList: [],
      moreList1: [],
      moreList2: [],
      teamNum1: '',
      teamNum2: '',
      number: '',

      // 抽奖
      indexs: -1, // 当前转动到哪个位置，起点位置
      counts: 8, // 总共有多少个位置
      timers: 0, // 每次转动定时器
      speeds: 200, // 初始转动速度
      times: 0, // 转动次数
      cycle: 30, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
      prize: -1, // 中奖位置
      click: true,

      canLottery: false,
      lottery_id: 4,
      lotteryType: [],
      loaded_l: false,
      award_day: '',
      fail: false,

      // 消息轮播
      animates: false,
      items: [],
      star: '',
      loaded_m: false,
      tmsg: null,
      tscroll: null
    }
  },
  computed: {
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
    shareWebUrl() {
      return `${window.location.origin}/activity/team/web.html?activity=${this.activity_id}&teamno=${this.teamNum}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`
    },
    shareLandUrl() {
      return `${window.location.origin}/activity/team/land.html?activity=${this.activity_id}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`
    }
  },
  created() {
    this.$axios.get(`/voting/team-building/v1/activity-info?team_activity_id=${this.activity_id}`).then(({ data }) => {
      if (data.code == 0) {
        this.activityStart = data.data.start_date
        this.activityEnd = data.data.end_date
        this.lottery_id = data.data.lottery_activity_id
        const during = Math.floor((this.activityEnd - this.activityStart) / 1000)
        const max = 10 * 10000
        const speed = Math.floor((max / during) * 100) / 100
        const period = Math.floor((this.$serverTime - this.activityStart) / 1000)
        this.number = formatAmount(10 + Math.floor(period * speed))
        this.getLotteryType()
      }
    })
  },
  mounted() {
    const teamno = getQuery('teamno')
    const searchFullTeamStatus = sessionStorage.getItem('search_full_team')
    if ((teamno && !isNaN(teamno) && window.history.length <= 1) || searchFullTeamStatus) {
      sessionStorage.removeItem('search_full_team')
      searchTeam.call(this, teamno, data => {
        if (data.code >= 2) {
          this.$refs.malert.show(data.message)
          return
        }
        if (data.data.newcomer) {
          if (data.code > 0) {
            this.mSendEvLog('teammatch_show', 'new', '1')
            this.$refs.findTeamAlert.show(this.$t('vote.team.joinpop_newuser'), () => {
              this.mSendEvLog('teammatch_click', 'ok', '1')
              if (this.$isLogin) {
                this.$refs.findTeamAlert.hide()
                this.toJoin(teamno)
              } else {
                toNativeLogin(this.$appType)
              }
            })
            this.fakeTeam()
          } else {
            // 当前搜索的队伍是满队
            this.isFull = true
            this.mumberList = data.data.team_member_dtos
            this.leader_name = this.mumberList[0].nick_name
            this.teamNum1 = data.data.team_recommend_dtos[0] ? data.data.team_recommend_dtos[0].team_no : 0
            this.teamNum2 = data.data.team_recommend_dtos[1] ? data.data.team_recommend_dtos[1].team_no : 0
            this.moreList1 = data.data.team_recommend_dtos[0] ? data.data.team_recommend_dtos[0].team_member_dtos : []
            this.moreList2 = data.data.team_recommend_dtos[1] ? data.data.team_recommend_dtos[1].team_member_dtos : []
          }
        } else {
          this.mSendEvLog('teammatch_show', 'old', '1')
          this.$refs.malert.show(this.$t('vote.team.joinpop_olduser'), () => {
            if (this.$isLogin) {
              this.toCreate()
            } else {
              this.fakeTeam()
            }
          })
        }
      })
    } else {
      if (this.$isLogin) {
        this.checkMyTeam(newcomer => {
          if (newcomer) {
            this.fakeTeam()
            this.$refs.confirm.show(
              () => {
                window.location.href = `/activity/team/search.html?activity=${this.activity_id}`
              },
              () => {
                this.toCreate()
                this.$refs.confirm.hide()
              }
            )
          } else {
            this.toCreate()
          }
        })
      } else {
        this.fakeTeam()
      }
    }
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
    changeTeam() {
      this.mSendEvLog('teammatch_click', 'change', '1')
      if (this.$isLogin) {
        window.location.href = `/activity/team/search.html?activity=${this.activity_id}`
      } else {
        toNativeLogin(this.$appType)
      }
    },
    toJoinFull(teamno) {
      this.mSendEvLog('joinbtn_click', 'h5recommend', '1')
      if (this.$isLogin) {
        this.toJoin(teamno)
        this.isFull = false
      } else {
        toNativeLogin(this.$appType)
      }
    },
    toJoin(teamno) {
      joinTeam.call(this, teamno, data => {
        if (data.code == 0) {
          this.team = data.data.team_member_dtos
          this.teamNum = teamno
          this.mSendEvLog('homepage_show', 'continue', '1')
          this.$nextTick(() => {
            this.msgScroll()
          })
          if (this.team.length >= 3) {
            this.canLottery = true
            this.mSendEvLog('teamsucc_show', '', '1')
            this.$refs.malert.show(this.$t('vote.team.form_succ'), () => {
              window.scrollTo(0, 1500)
              this.startLottery()
            })
          }
        } else if (data.code == 4) {
          // 已参加过队伍，不能参加队伍
          if (this.hasFinish) {
            this.$refs.malert.show(this.$t('vote.team.share10_2'))
          } else {
            this.$refs.malert.show(this.$t('vote.team.have_team'), () => {
              this.checkMyTeam()
            })
          }
        } else if (data.code == 1) {
          // 不是新用户，需要创建队伍
          this.mSendEvLog('teammatch_show', 'old', '1')
          this.$refs.malert.show(this.$t('vote.team.joinpop_olduser'))
          this.toCreate()
        } else if (data.code == 2) {
          // 已经满了，再加入个别的吧
          this.isFull = true
          this.mumberList = data.data.team_member_dtos
          this.leader_name = this.mumberList[0].nick_name
          this.teamNum1 = data.data.team_recommend_dtos[0] ? data.data.team_recommend_dtos[0].team_no : 0
          this.teamNum2 = data.data.team_recommend_dtos[1] ? data.data.team_recommend_dtos[1].team_no : 0
          this.moreList1 = data.data.team_recommend_dtos[0] ? data.data.team_recommend_dtos[0].team_member_dtos : []
          this.moreList2 = data.data.team_recommend_dtos[1] ? data.data.team_recommend_dtos[1].team_member_dtos : []
        } else {
          this.$refs.malert.show(data.message)
        }
      })
    },
    toCreateFull() {
      if (this.$isLogin) {
        this.isFull = false
        this.toCreate()
      } else {
        toNativeLogin(this.$appType)
      }
    },
    toCreate() {
      createTeam.call(this, data => {
        if (data.code == 0) {
          // 创建成功
          this.checkMyTeam()
        } else if (data.code == 1) {
          // 当前有队不能创建
          this.checkMyTeam()
        } else if (data.code == 2) {
          // 已经达到了最高限制
          this.hasFinish = true
          this.mSendEvLog('homepage_show', 'finish', '1')
        } else {
          this.$refs.malert.show(data.message)
        }
      })
    },
    fakeTeam() {
      this.team = [
        {
          nick_name: this.$user.nickName,
          logo: this.$user.head || 'https://cdn.startimestv.com/head/h_d.png'
        }
      ]
      this.$nextTick(() => {
        this.msgScroll()
      })
    },
    checkMyTeam(failback) {
      searchMyTeam.call(this, data => {
        if (data.code == 0) {
          this.team = data.data.team_member_dtos
          this.teamNum = data.data.team_no
          this.mSendEvLog('homepage_show', 'continue', '1')
          this.$nextTick(() => {
            this.msgScroll()
          })
          if (this.team.length >= 3 && data.data.allow_lottery) {
            this.mSendEvLog('teamsucc_show', '', '1')
            this.$refs.malert.show(this.$t('vote.team.form_succ'), () => {
              window.scrollTo(0, 1500)
              this.canLottery = true
              this.startLottery()
            })
          }
        } else {
          if (data.data.team_limit_arrived) {
            this.hasFinish = true
            this.mSendEvLog('homepage_show', 'finish', '1')
          }
          failback && failback(data.data.newcomer)
        }
      })
    },
    toFacebook() {
      this.mSendEvLog('inviteway_click', 'Facebook', '1')
      if (this.$appType == 1) {
        if (this.hasFinish == true) {
          shareByFacebook(this.shareLandUrl, `【${this.shareTitle}】 ${this.shareText} `)
        } else {
          shareByFacebook(this.shareWebUrl, `【${this.shareTitle}】 ${this.shareText} `)
        }
      }
    },
    toWhatsApp() {
      this.mSendEvLog('inviteway_click', 'WhatsApp', '1')
      if (this.$appType == 1) {
        if (this.hasFinish == true) {
          shareByWhatsApp(this.shareLandUrl, this.shareTitle, this.shareText, this.imgUrl)
        } else {
          shareByWhatsApp(this.shareWebUrl, this.shareTitle, this.shareText, this.imgUrl)
        }
      }
    },
    toXender() {
      if (this.hasFinish) {
        this.mSendEvLog('inviteway_click', 'Xender', '0')
        this.$refs.malert.show(this.$t('vote.team.share10_2'))
        return
      }
      this.mSendEvLog('inviteway_click', 'Xender', '1')
      if (this.$appType == 1) {
        if (this.teamNum) {
          shareByXender(this.teamNum)
        }
      }
    },
    toDownload() {
      if (this.hasFinish) {
        this.mSendEvLog('inviteway_click', 'download', '0')
        this.$refs.malert.show(this.$t('vote.team.share10_2'))
        return
      }
      this.mSendEvLog('inviteway_click', 'download', '1')
      if (window.getChannelId && window.getChannelId.shareDownload) {
        if (this.teamNum) {
          searchTeam.call(this, this.teamNum, data => {
            const team = data.data.team_member_dtos
            if (team && team.length > 0) {
              const teamLeader = team[0].nick_name || team[0].user_id
              const logoArr = []
              team.forEach(item => {
                logoArr.push(item.logo || 'https://cdn.startimestv.com/head/h_d.png')
              })
              window.getChannelId.shareDownload(teamLeader, this.teamNum, logoArr.join(','))
            }
          })
        }
      }
    },
    toCopylink() {
      this.mSendEvLog('inviteway_click', 'copylink', '1')
      if (this.$appType == 1) {
        if (this.hasFinish == true) {
          shareByCopyLink(this.shareLandUrl)
        } else {
          shareByCopyLink(this.shareWebUrl)
        }
      }
    },
    toSearch() {
      this.mSendEvLog('searchbtn_click', '', '1')
      if (this.$isLogin) {
        window.location.href = `/activity/team/search.html?activity=${this.activity_id}`
      } else {
        toNativeLogin(this.$appType)
      }
    },
    showShare() {
      if (this.hasFinish) {
        this.mSendEvLog('invitebtn_click', 'teamover', '1')
      } else {
        if (this.isFull) {
          this.mSendEvLog('invitebtn_click', 'teamfull', '1')
        } else {
          this.mSendEvLog('invitebtn_click', 'teaminvpage', '1')
        }
      }
      if (this.$isLogin) {
        if (this.$appVersion) {
          // 5.20版本
          this.show_share = true
        } else {
          if (this.hasFinish == true) {
            shareInvite(this.shareLandUrl, this.shareTitle, this.shareText, this.imgUrl)
          } else {
            shareInvite(this.shareWebUrl, this.shareTitle, this.shareText, this.imgUrl)
          }
        }
      } else {
        toNativePage('com.star.mobile.video.account.LoginActivity')
      }
    },
    // 获取消息列表
    getMsgList() {
      this.$axios
        .get(`/voting/lottery/v1/winnings?lottery_id=${this.lottery_id}`)
        .then(res => {
          if (res.data.code === 0) {
            if (this.$serverTime <= this.activityStart) {
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
                if (item.user_id) item.user_id = item.user_id.toString().replace(/(.*)\d{2}/, '$1**')
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
            console.log('Get winnings error!')
            // this.$refs.malert.show('Get winnings error!')
          }
        })
        .catch(err => {
          this.items = []
          console.log('Get winnings error!! ' + err)
          // this.$refs.malert.show('Get winnings error!! ' + err)
        })
    },
    msgScroll() {
      this.tmsg = null
      this.tscroll = null
      this.tmsg = setInterval(() => {
        if (this.$serverTime > this.activityEnd) clearInterval(this.tmsg)
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
    // 获取抽奖种类
    getLotteryType() {
      this.$axios
        .get(`/voting/lottery/v1/rewards?lottery_id=${this.lottery_id}`)
        .then(res => {
          if (res.data.code === 0) {
            this.lotteryType = res.data.data
          } else {
            this.lotteryType = [] // 服务器端计算数据错误时
            this.$refs.malert.show('Get rewards error!')
          }
          this.loaded_l = true
          this.getMsgList()
        })
        .catch(err => {
          this.lotteryType = []
          this.$refs.malert.show('Get rewards error!! ' + err)
        })
    },
    startLottery() {
      if (this.$isLogin) {
        if (!this.click) return
        if (this.canLottery) {
          this.speeds = 200
          this.click = false
          this.startRoll()
        } else {
          this.mSendEvLog('drawbtn_click', '', '0')
          if (this.hasFinish) {
            this.$refs.malert.show(this.$t('vote.team.share10_2'))
          } else {
            this.$refs.malert.show(this.$t('vote.team.form_noform'), () => {
              window.scrollTo(0, 0)
              this.showShare()
            })
          }
        }
      } else {
        this.$refs.malert.show(this.$t('vote.team.invite_tips'))
      }
    },
    // 开始转动
    startRoll() {
      this.times += 1 // 转动次数
      this.oneRoll() // 转动过程调用的每一次转动方法，这里是第一次调用初始化
      const tmpTeamId = this.teamNum

      // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
      if (this.times > this.cycle + 10 && this.prize === this.indexs) {
        clearTimeout(this.timers) // 清除转动定时器，停止转动
        this.times = 0
        console.log('你已经中奖了，位置' + (this.indexs + 1))
        console.log('你已经中奖了，奖品' + this.lotteryType[this.indexs].name)
        if (this.prize < 3) {
          setTimeout(() => {
            if (this.prize == 0) this.mSendEvLog('teamsucc_result', '1day', '1')
            else if (this.prize == 1) this.mSendEvLog('teamsucc_result', '7day', '1')
            else if (this.prize == 2) this.mSendEvLog('teamsucc_result', '30day', '1')
            location.replace(`/activity/team/result.html?activity=${this.activity_id}&teamno=${tmpTeamId}&prize=${this.award_day}`)
          }, 1000)
        } else if (this.prize == 3) {
          if (this.fail) {
            setTimeout(() => {
              this.$refs.malert.show('lottery error!!')
            }, 1000)
          } else {
            setTimeout(() => {
              this.mSendEvLog('teamsucc_result', 'thanks', '1')
              this.$refs.malert.show(this.$t('vote.team.draw_none'))
            }, 1000)
          }
        }
      } else {
        if (this.times < this.cycle) {
          this.speeds -= 10 // 加快转动速度
        } else if (this.times === this.cycle) {
          // 后台取得一个中奖位置
          this.$axios
            .post(`/voting/team-award/v1/user/award?team_activity_id=${this.activity_id}&team_no=${this.teamNum}`)
            .then(res => {
              if (res.data.code == 0) {
                this.award_day = res.data.data.award_day
                if (this.award_day == 1 || this.award_day == 7 || this.award_day == 30) {
                  for (let i = 0; i < this.lotteryType.length; i++) {
                    if (this.award_day == this.lotteryType[i].name.split(' ')[1]) {
                      this.prize = i
                    }
                  }
                  console.log(`中奖位置${this.prize + 1}`)
                }
              } else if (res.data.code == 1) {
                this.prize = 3
              } else {
                this.fail = true
                this.prize = 3
              }
            })
            .catch(() => {
              this.fail = true
              this.prize = 3
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
  min-height: 100vh;
  font-size: 0.9rem;
  letter-spacing: -0.03rem;
  position: static;
  background-image: linear-gradient(#7c003d, #6c0049);
  .team-normal {
    .box {
      position: relative;
      z-index: 2;
      width: 95%;
      margin: 0 auto;
      .title {
        background-image: linear-gradient(rgba(189, 4, 78, 0.5), rgba(165, 3, 80, 0.5));
        width: 80%;
        color: #ffbc00;
        border-top-right-radius: 1rem;
        border-top-left-radius: 1rem;
        padding-left: 0.8rem;
        line-height: 1.8rem;
        font-size: 0.9rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      .contant {
        padding: 0.5rem;
        background-image: linear-gradient(rgba(165, 3, 80, 0.5), #600165);
        border-radius: 1rem;
        border-top-left-radius: 0;
        color: #fff;
      }
    }
    .invite {
      margin-bottom: 0.5rem;
      .title {
        width: 100%;
        background-color: #c20044;
      }
      .contant {
        padding: 0.5rem 0.5rem 1.5rem;
        position: relative;
        border-top-right-radius: 0;
        > div {
          display: inline-block;
          width: 20%;
          > div {
            width: 100%;
            position: relative;
            border: 2px solid #8700b1;
            border-radius: 50%;
            overflow: hidden;
            background-image: url('~@/assets/img/vote/TeamFission/bg-add.png');
            background-size: 100% 100%;
            img {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
            }
            &:before {
              content: '';
              display: inline-block;
              padding-bottom: 100%;
              width: 0;
              vertical-align: middle;
            }
          }
          span {
            color: #9f00ee;
            position: absolute;
            left: 6%;
          }
        }
        :nth-child(1) {
          margin-right: 5%;
        }
        :nth-child(2) {
          margin-right: 6%;
        }
        :nth-child(3) {
          margin-right: 10%;
        }
        > img {
          width: 18%;
          position: relative;
          top: -1.4rem;
        }
      }
      .finish {
        color: #ffbc00;
        height: 8rem;
        line-height: 2rem;
        font-size: 1.2rem;
        padding: 2rem 0.5rem;
        margin: 0.5rem auto;
        border-radius: 1rem;
        background-color: #a1014b;
        text-align: center;
        font-weight: bold;
      }
    }
    .friends-box {
      width: 100%;
      margin-top: 0.5rem;
      height: 3rem;
      &.normal {
        .img {
          float: left;
          width: 17%;
          height: 3rem;
          background-image: url('~@/assets/img/vote/TeamFission/btn-search.png');
          background-size: contain;
          background-repeat: no-repeat;
        }
        .friends {
          float: left;
          width: 83%;
          height: 3rem;
          position: relative;
          background: linear-gradient(180deg, rgba(253, 94, 0, 1) 0%, rgba(250, 0, 67, 1) 100%);
          border-radius: 25px;
          border: 0.2rem solid rgba(26, 1, 96, 0.75);
          color: #ffffff;
          height: 3rem;
          line-height: 2.6rem;
          img {
            height: 1.2rem;
            position: absolute;
            left: 7%;
            top: 0.7rem;
          }
          p {
            width: 80%;
            text-align: center;
            font-weight: bold;
            margin-left: 17%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      &.finished {
        .img {
          display: none;
        }
        .friends {
          width: 100%;
          height: 3rem;
          position: relative;
          background: linear-gradient(180deg, rgba(253, 94, 0, 1) 0%, rgba(250, 0, 67, 1) 100%);
          border-radius: 25px;
          border: 0.2rem solid rgba(26, 1, 96, 0.75);
          color: #ffffff;
          height: 3rem;
          line-height: 2.6rem;
          img {
            height: 1.2rem;
            position: absolute;
            left: 7%;
            top: 0.7rem;
          }
          p {
            width: 80%;
            text-align: center;
            font-weight: bold;
            margin-left: 17%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .share-box {
      width: 95%;
      margin: 0.5rem auto;
      padding: 0.5rem;
      background-color: #a1014b;
      height: 11rem;
      border-radius: 1rem;
      > img {
        width: 20%;
        &:first-child {
          display: block;
          margin-left: 93%;
          margin-bottom: 1rem;
          width: 7%;
          background-image: url('~@/assets/img/vote/TeamFission/ic_download.png');
        }
      }
      > div {
        span {
          display: inline-block;
          width: 20%;
          vertical-align: top;
          text-align: center;
          line-height: 1rem;
          font-size: 0.75rem;
          color: #fff;
        }
      }
    }
    .lottery {
      .contant {
        .lottery-type {
          width: 100%;
          margin: 0 auto;
          background-image: url('~@/assets/img/vote/TeamFission/bg-lottery.png');
          background-size: 100% 101%;
          color: #ad5500;
          ul {
            width: 100%;
            margin: 0 auto;
            border-radius: 0.5rem;
            position: relative;
            &:before {
              content: '';
              display: inline-block;
              padding-bottom: 100%;
              width: 0;
              vertical-align: middle;
            }
            li {
              width: 28%;
              display: block;
              position: absolute;
              overflow: hidden;
              background-color: #fff;
              border: 0.25rem solid transparent;
              border-radius: 0.5rem;
              background-color: #a80044;
              &:nth-child(1) {
                left: 6%;
                top: 6%;
              }
              &:nth-child(2) {
                left: 36%;
                top: 6%;
              }
              &:nth-child(3) {
                left: 66%;
                top: 6%;
              }
              &:nth-child(4) {
                left: 66%;
                top: 36%;
              }
              &:nth-child(5) {
                left: 66%;
                top: 66%;
              }
              &:nth-child(6) {
                left: 36%;
                top: 66%;
              }
              &:nth-child(7) {
                left: 6%;
                top: 66%;
              }
              &:nth-child(8) {
                left: 6%;
                top: 36%;
              }
              &.active {
                background-color: #ff0090;
              }
              > div {
                width: 100%;
                .prize {
                  img {
                    display: block;
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
            .getLuck {
              width: 28%;
              border-radius: 0.5rem;
              text-align: center;
              position: absolute;
              top: 36%;
              left: 36%;
              font-size: 1.1rem;
              font-weight: bold;
              color: #fdf2ff;
              background-color: #ff008a;
              border: 0.25rem solid #ff4ca3;
              &:active {
                background-color: #8b0048;
                border: 0.25rem solid #9f195f;
                color: #e0aac9;
              }
              &:before {
                content: '';
                display: inline-block;
                padding-bottom: 100%;
                width: 0;
                vertical-align: middle;
              }
            }
          }
        }
      }
    }
    .msg-box {
      width: 95%;
      margin: 0 auto;
      padding: 0.5rem 0 1rem;
      .msg {
        width: 100%;
        height: 2rem;
        line-height: 2rem;
        overflow: hidden;
        transition: all 0.5s;
        position: relative;
        margin-bottom: 0.3rem;
        background-color: #26010e;
        border-radius: 1rem;
        .anim {
          transition: all 0.5s;
        }
        img {
          position: absolute;
          display: block;
          width: 1.1rem;
          height: 1.1rem;
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
            font-size: 0.75rem;
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  .team-full {
    padding-bottom: 1rem;
    .text {
      width: 95%;
      position: relative;
      line-height: 1.7rem;
      font-size: 0.8rem;
      padding-left: 0.5rem;
      color: #fff;
      border-top-right-radius: 1rem;
      border-top-left-radius: 1rem;
      background-color: #c20044;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      color: #ffbc00;
      font-weight: bold;
      &.text1 {
        margin: 0 auto;
      }
      &.text2 {
        margin: 0.5rem auto 0;
      }
      &.text3 {
        margin: 0.5rem auto 0;
        text-align: center;
      }
    }
    .invite {
      width: 95%;
      margin: 0 auto;
      position: relative;
      background-image: linear-gradient(#94027d, #540173);
      padding: 1rem 0.5rem;
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
      .team {
        width: 85%;
        margin: 0 auto 0.5rem;
        text-align: center;
        .mumber {
          width: 33%;
          float: left;
          > div {
            width: 65%;
            position: relative;
            margin: 0 auto;
            border: 2px solid #8600c8;
            border-radius: 100%;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
            }
            &:before {
              content: '';
              display: inline-block;
              padding-bottom: 100%;
              width: 0;
              vertical-align: middle;
            }
          }
          p {
            background: rgba(134, 0, 200, 1);
            border-radius: 8px;
            display: inline-block;
            padding: 0 0.5rem;
            position: relative;
            top: -0.7rem;
            color: #b360dd;
            font-size: 0.9rem;
            height: 1.1rem;
            line-height: 1.1rem;
          }
        }
      }
      > span {
        display: block;
        width: 95%;
        margin: 0 auto;
        padding-left: 0.5rem;
        color: #b360dd;
        font-size: 0.75rem;
        text-align: center;
      }
      .team-btn {
        width: 85%;
        margin: 0.5rem auto;
        text-align: center;
        span {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }
        > div {
          background: linear-gradient(180deg, rgba(253, 94, 0, 1) 0%, rgba(250, 0, 67, 1) 100%);
          border-radius: 25px;
          border: 0.25rem solid rgba(26, 1, 96, 0.75);
          color: #ffffff;
          height: 2.75rem;
          line-height: 2.25rem;
          margin-top: 0.5rem;
        }
      }
      .copy {
        width: 85%;
        position: relative;
        margin: 0 auto;
        :nth-child(1),
        :nth-child(2),
        :nth-child(3) {
          color: #fff;
          display: inline-block;
          height: 2rem;
          line-height: 2rem;
        }
        :nth-child(1) {
          width: 25%;
          padding-left: 2%;
          padding-right: 3%;
          font-size: 0.75rem;
        }
        :nth-child(2) {
          width: 75%;
          background-color: #350052;
          padding-right: 22%;
          text-align: center;
          border-radius: 1rem;
          letter-spacing: 3px;
        }
        :nth-child(3) {
          position: absolute;
          right: 0;
          top: -1px;
          width: 25%;
          color: #ffbc00;
          background-color: #1c003e;
          border: 1px solid #ffbc00;
          border-radius: 1rem;
          text-align: center;
        }
      }
    }
    .more-team {
      width: 95%;
      margin: 0 auto;
      position: relative;
      background-image: linear-gradient(#94027d, #540173);
      padding: 1rem 0.5rem;
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
      .team1,
      .team2 {
        color: #fff;
        .team-id {
          width: 90%;
          font-size: 0.75rem;
          height: 2rem;
          line-height: 2rem;
          margin: 0 auto;
        }
        .team-box {
          .team {
            width: 65%;
            text-align: center;
            display: inline-block;
            .mumber {
              width: 33%;
              float: left;
              img {
                width: 65%;
                position: relative;
                margin: 0 auto;
                border: 2px solid #8600c8;
                border-radius: 100%;
              }
            }
          }
          .join {
            width: 25%;
            height: 2rem;
            display: inline-block;
            font-size: 0.75rem;
            font-weight: bold;
            position: relative;
            right: -5%;
            top: -1.5rem;
            > div {
              width: 80%;
              height: 2rem;
              line-height: 1.7rem;
              border-radius: 1rem;
              border: 0.15rem solid #fa7a00;
              text-align: center;
              background-color: #37006f;
            }
          }
        }
      }
    }
  }
}
</style>
