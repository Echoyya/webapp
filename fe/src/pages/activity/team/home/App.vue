<template>
  <div class="wrapper">
    <mBanner />
    <countdown :teamNo="teamNum" :activityStart="activityStart" :activityEnd="activityEnd" />
    <div v-show="!show_share" class="invite box">
      <div v-show="!hasFinish" class="title">{{$t('vote.team.invite_tips')}}</div>
      <div v-show="!hasFinish" v-if="team.length>0" class="contant">
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
      <div v-show="hasFinish" class="finish">
        {{$t('vote.team.share10_1')}}
        <br />
        {{$t('vote.team.share10_2')}}
      </div>
      <div class="firends-box clearfix">
        <div class="img" @click="toSearch"></div>
        <div class="friends" @click="showShare">
          <img src="@/assets/img/vote/TeamFission/ic_share.png" />
          <p>{{$t('vote.team.invite_btn')}}</p>
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
    <malert ref="malert" />
    <malert ref="findTeamAlert">
      <a slot="link" href="/activity/team/search.html">CHANGE</a>
    </malert>
  </div>
</template>
<script>
import mBanner from '@/pages/activity/team/banner.vue'
import { searchTeam, joinTeam, createTeam, searchMyTeam } from '@/pages/activity/team/func'
import { shareByFacebook, shareByWhatsApp, shareByXender, shareByCopyLink, getQuery, toNativePage, shareInvite, toNativeLogin } from '@/functions/app'
import malert from '@/pages/activity/team/malert'
import countdown from '@/pages/activity/team/countdown'
export default {
  components: {
    mBanner,
    malert,
    countdown
  },
  data() {
    return {
      // 页面
      imgUrl: 'http://cdn.startimestv.com/banner/BSSVote2-banner.png',
      shareTitle: this.$t('vote.team.shareTitle'),
      shareText: this.$t('vote.team.shareText'),

      activityStart: new Date('2019-11-15T00:00:00'.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime(),
      activityEnd: new Date('2019-11-25T04:00:00'.replace(/-/g, '/').replace('T', ' ') + '+0000').getTime(),
      show_share: false,
      hasFinish: false,

      //team
      team: [],
      teamNum: '',
      activity_id: getQuery('activiy') || 1,

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
    }
  },
  mounted() {
    const teamno = getQuery('teamno')

    if (teamno && !isNaN(teamno)) {
      history.replaceState({ origin: 1 }, '', '/activity/team/home.html')

      searchTeam.call(this, teamno, data => {
        if (data.code >= 2) {
          this.$refs.malert.show(data.message)
          return
        }
        if (data.data.newcomer) {
          if (data.code > 0) {
            // can join
            const teamLeader = data.data.team_member_dtos[0].nick_name || data.data.team_member_dtos[0].id
            this.$refs.findTeamAlert.show(
              'Here! You are going to join ' + teamLeader + '`s team',
              () => {
                if (this.$isLogin) {
                  this.toJoin(teamno)
                } else {
                  localStorage.setItem('join_teamno', teamno)
                  toNativeLogin(this.$appType)
                }
              },
              'OK'
            )
            this.fakeTeam()
          } else {
            // team is full
            this.$refs.malert.show(this.$t('vote.team.full_team') + '.' + this.$t('vote.team.to_change_team'), () => {
              location.href = '/activity/team/search.html'
            })
          }
        } else {
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
        const cacheTeamNo = localStorage.getItem('join_teamno')
        this.checkMyTeam(() => {
          // check my team failed
          if (cacheTeamNo) {
            this.toJoin(cacheTeamNo)
            localStorage.removeItem('join_teamno')
          } else {
            this.toCreate()
          }
        })
      } else {
        this.fakeTeam()
      }
    }
    this.getLotteryType()
    this.getMsgList()
    this.msgScroll()
  },
  methods: {
    toJoin(teamno) {
      joinTeam.call(this, teamno, data => {

        // TODO 确认data.code ==4 是否属于这个分支
        if (data.code == 0 || data.code == 4) {
          this.team = data.data.team_member_dtos
          this.teamNum = teamno
          if (data.code == 4) {
            this.$refs.malert.show(data.message)
          }
          if (this.team.length >= 3) {
            this.canLottery = true
            this.$refs.malert.show(this.$t('vote.team.form_succ'), () => {
              window.scrollTo(0, 1500)
              this.startLottery()
            })
          }
        } else if (data.code == 1) {
          // 不是新用户，需要创建队伍
          this.$refs.malert.show(this.$t('vote.team.joinpop_olduser'))
          this.toCreate()
        } else if (data.code == 2) {
          // 已经满了，再加入个别的吧
          this.$refs.malert.show(this.$t('vote.team.full_team') + '.' + this.$t('vote.team.to_change_team'), () => {
            window.location.href = '/activity/team/search.html'
          })
        } else {
          this.$refs.malert.show(data.message)
        }
      })
    },
    toCreate() {
      createTeam.call(this, data => {
        if (data.code == 0) {
          this.team = data.data.team_member_dtos
          this.teamNum = data.data.team_no
        } else if (data.code == 1) {
          this.checkMyTeam()
        } else if (data.code == 2) {
          // 已经达到了最高限制
          this.hasFinish = true
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
    },
    checkMyTeam(failback) {
      searchMyTeam.call(this, data => {
        if (data.code == 0) {
          this.team = data.data.team_member_dtos
          this.teamNum = data.data.team_no
          if (this.team.length >= 3 && data.data.allow_lottery) {
            this.$refs.malert.show(this.$t('vote.team.form_succ'), () => {
              window.scrollTo(0, 1500)
              this.canLottery = true
              this.startLottery()
            })
          }
        } else {
          if (data.data.team_limit_arrived) {
            this.hasFinish = true
          }
          failback && failback()
        }
      })
    },
    toFacebook() {
      if (this.$appType == 1) {
        if (this.hasFinish == true) {
          shareByFacebook(
            `${window.location.origin}/activity/team/land.html?utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`,
            `【${this.shareTitle}】 ${this.shareText} `
          )
        } else {
          shareByFacebook(
            `${window.location.origin}/activity/team/web.html?teamno=${this.teamNum}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`,
            `【${this.shareTitle}】 ${this.shareText} `
          )
        }
      }
    },
    toWhatsApp() {
      if (this.$appType == 1) {
        if (this.hasFinish == true) {
          shareByWhatsApp(
            `${window.location.origin}/activity/team/land.html?utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`,
            this.shareTitle,
            this.shareText,
            this.imgUrl
          )
        } else {
          shareByWhatsApp(
            `${window.location.origin}/activity/team/web.html?teamno=${this.teamNum}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`,
            this.shareTitle,
            this.shareText,
            this.imgUrl
          )
        }
      }
    },
    toXender() {
      if (this.$appType == 1) {
        if (this.teamNum) {
          shareByXender(this.teamNum)
        }
      }
    },
    toDownload() {
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
      if (this.$appType == 1) {
        if (this.hasFinish == true) {
          shareByCopyLink(`${window.location.origin}/activity/team/land.html?utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`)
        } else {
          shareByCopyLink(
            `${window.location.origin}/activity/team/web.html?teamno=${this.teamNum}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`
          )
        }
      }
    },
    toSearch() {
      window.location.href = '/activity/team/search.html'
    },
    showShare() {
      if (this.$isLogin) {
        this.show_share = true
        if (this.$appVersion) {
          // 5.20版本
          this.show_share = true
        } else {
          if (this.hasFinish == true) {
            shareInvite(
              `${window.location.origin}/activity/team/land.html?utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`,
              this.shareTitle,
              this.shareText,
              this.imgUrl
            )
          } else {
            shareInvite(
              `${window.location.origin}/activity/team/web.html?teamno=${this.teamNum}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`,
              this.shareTitle,
              this.shareText,
              this.imgUrl
            )
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
            this.$refs.malert.show('Get winnings error!')
          }
        })
        .catch(err => {
          this.items = []
          this.$refs.malert.show('Get winnings error!! ' + err)
        })
    },
    msgScroll() {
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
            console.log(this.lotteryType.picture_url)
          } else {
            this.lotteryType = [] // 服务器端计算数据错误时
            this.$refs.malert.show('Get rewards error!')
          }
          this.loaded_l = true
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
          this.$refs.malert.show(this.$t('vote.team.form_noform'), () => {
            window.scrollTo(0, 0)
            this.showShare()
          })
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
            location.replace('/activity/team/result.html?teamno=' + tmpTeamId + '&prize=' + this.award_day)
          }, 1000)
        } else if (this.prize == 3) {
          if (this.fail) {
            setTimeout(() => {
              this.$refs.malert.show('lottery error!!')
            }, 1000)
          } else {
            setTimeout(() => {
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
              // TODO 提示
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
  font-size: 0.9rem;
  letter-spacing: -0.03rem;
  position: static;
  background-image: linear-gradient(#7c003d, #6c0049);
  .box {
    position: relative;
    z-index: 2;
    width: 95%;
    margin: 0 auto;
    .title {
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
  .invite {
    margin-bottom: 0.5rem;
    .title {
      width: 100%;
      background-color: #c20044;
    }
    .contant {
      padding: 0.5rem 0.5rem 1.5rem;
      position: relative;
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
    .firends-box {
      width: 100%;
      margin-top: 0.5rem;
      height: 3rem;
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
          left: 15%;
          top: 0.7rem;
        }
        p {
          text-align: center;
          font-weight: bold;
        }
      }
    }
  }
  .share-box {
    width: 95%;
    margin: 0.5rem auto;
    padding: 0.5rem;
    background-color: #a1014b;
    height: 10rem;
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
            font-size: 1.2rem;
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
</style>
