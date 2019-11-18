<template>
  <div class="wrapper">
    <mBanner />
    <countdown :teamNo="teamNum" :activityStart="activityStart" :activityEnd="activityEnd" />
    <div v-if="team.length>0" v-show="!show_share" class="invite box">
      <div v-show="!hasFinish" class="title">{{$t('vote.team.invite_tips')}}</div>
      <div v-show="!hasFinish" class="contant">
        <div>
          <div>
            <img :src="team[0].logo" alt />
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
                  <p>{{item.name}}</p>
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
import { shareByFacebook, shareByWhatsApp, shareByXender, shareByCopyLink, getQueryVariable, toNativePage, shareInvite } from '@/functions/app'
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

      activityStart: new Date('2019-11-15 00:00:00').getTime(),
      activityEnd: new Date('2019-11-25 04:00:00').getTime(),
      show_share: false,
      hasFinish: false,

      //team
      team: [],
      teamNum: '',
      team_activity_id: 1, // TODO 活动id抽离

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
    const teamno = getQueryVariable(location.search.replace('?', ''), 'teamno')
    if (teamno && !isNaN(teamno)) {
      history.replaceState({ origin: 1 }, '', '/activity/team/home.html')
      searchTeam.call(this, teamno, data => {
        if (data.code >= 2) {
          //未找到队伍
          this.$refs.malert.show(data.message)
        } else {
          if (data.data.newcomer) {
            if (data.code > 0) {
              // 队伍未满
              const teamLeader = data.data.team_member_dtos[0].nick_name
              this.$refs.findTeamAlert.show(
                'Here! You are going to join ' + teamLeader + '`s team',
                () => {
                  // 加入队伍
                  if (this.$isLogin) {
                    this.toJoin(teamno)
                  } else if (this.$appType === 1) {
                    localStorage.setItem('join_teamno', this.teamNum)
                    toNativePage('com.star.mobile.video.account.LoginActivity')
                  } else {
                    localStorage.setItem('join_teamno', this.teamNum)
                    toNativePage('startimes://login')
                  }
                },
                'OK'
              )
            } else {
              // 队伍已满
              this.$refs.malert.show(this.$t('vote.team.full_team') + '.' + this.$t('vote.team.to_change_team'), () => {
                location.href = '/activity/team/search.html'
              })
            }
          } else {
            // 老用户
            this.$refs.malert.show(this.$t('vote.team.joinpop_olduser'), () => {
              if (this.$isLogin) {
                this.toCreate()
              } else {
                this.fakeTeam()
              }
            })
          }
        }
      })
    } else {
      if (this.$isLogin) {
        // 获取缓存的teamNo
        const cacheTeamNo = localStorage.getItem('join_teamno')
        this.checkMyTeam(() => {
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
        if (data.code == 0 || data.code == 4) {
          // 加入成功
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
          this.team = [
            {
              nick_name: data.data.leader_nick_name,
              logo: data.data.leader_logo || 'http://cdn.startimestv.com/head/upload/f3a83a46-00bb-42ca-9380-a13d6a3c4fc1.png'
            }
          ]
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
          logo: this.$user.head || 'http://cdn.startimestv.com/head/upload/f3a83a46-00bb-42ca-9380-a13d6a3c4fc1.png'
        }
      ]
    },
    checkMyTeam(failback) {
      searchMyTeam.call(this, data => {
        if (data.code == 0) {
          this.team = data.data.team_member_dtos
          this.teamNum = data.data.team_no
          if (this.team.length >= 3) {
            this.canLottery = true
            this.$refs.malert.show(this.$t('vote.team.form_succ'), () => {
              window.scrollTo(0, 1500)
              this.startLottery()
            })
          }
        } else {
          failback && failback()
        }
      })
    },
    toFacebook() {
      if (this.$appType == 1) {
        shareByFacebook(
          `${window.location.origin}/activity/team/web.html?teamno=${this.teamNum}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`,
          this.shareTitle,
          this.shareText,
          this.imgUrl
        )
      }
    },
    toWhatsApp() {
      if (this.$appType == 1) {
        shareByWhatsApp(
          `${window.location.origin}/activity/team/web.html?teamno=${this.teamNum}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`,
          this.shareTitle,
          this.shareText,
          this.imgUrl
        )
      }
    },
    toXender() {
      if (this.$appType == 1) {
        shareByXender(this.teamNum)
      }
    },
    toDownload() {
      if (window.getChannelId && window.getChannelId.shareDownload) {
        window.getChannelId.shareDownload(
          'fea',
          '12312',
          'https://cdn.startimestv.com/head/h_d.png,https://cdn.startimestv.com/head/h_d.png,https://cdn.startimestv.com/head/h_d.png'
        )
      }
    },
    toCopylink() {
      if (this.$appType == 1) {
        shareByCopyLink(
          `${window.location.origin}/activity/team/web.html?teamno=${this.teamNum}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`
        )
      }
    },
    toSearch() {
      window.location.href = '/activity/team/search.html'
    },
    showShare() {
      if (this.$isLogin) {
        if (this.$appVersion) {
          this.show_share = true
        } else {
          shareInvite(
            `${window.location.origin}/activity/team/web.html?teamno=${this.teamNum}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`,
            this.shareTitle,
            this.shareText,
            this.imgUrl
          )
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
            // for (let i = 0; i < this.lotteryType.length; i++) {
            //   if (this.lotteryType[i].name == 'Thanks') this.prize = 3
            // }
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
        // this.prize = -1
        this.times = 0
        console.log('你已经中奖了，位置' + (this.indexs + 1))
        console.log('你已经中奖了，奖品' + this.lotteryType[this.indexs].name)
        if (this.prize < 3) {
          setTimeout(() => {
            // this.$refs.malert.show(`你已经中奖了，奖品'${this.lotteryType[this.indexs].name}`, () => {
            location.replace('/activity/team/result.html?teamno=' + tmpTeamId + '&prize=' + this.award_day)
            // })
          }, 1000)
        } else if (this.prize == 3) {
          if (this.fail) {
            setTimeout(() => {
              this.$refs.malert.show('lottery error!!')
            }, 1000)
          }
          setTimeout(() => {
            this.$refs.malert.show(this.$t('vote.team.draw_none'))
          }, 1000)
        }
      } else {
        if (this.times < this.cycle) {
          this.speeds -= 10 // 加快转动速度
        } else if (this.times === this.cycle) {
          // 后台取得一个中奖位置
          this.$axios
            .post(`/voting/team-award/v1/user/award?team_activity_id=${this.team_activity_id}&team_no=${this.teamNum}`)
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
          font-style: normal;
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
      font-style: normal;
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
          font-style: normal;
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
    height: 23rem;
    .contant {
      padding: 0;
      height: 20.5rem;
      padding: 0.5rem 0 0.5rem;
      .lottery-type {
        width: 100%;
        height: 19.5rem;
        margin: 0 auto;
        background-image: url('~@/assets/img/vote/TeamFission/bg-lottery.png');
        background-size: 100% 19.5rem;
        color: #ad5500;
        font-style: normal;
        ul {
          width: 90%;
          margin: 0 auto;
          border-radius: 0.5rem;
          padding: 0.2rem 0;
          position: relative;
          height: 20rem;
          li {
            width: 30%;
            height: 5.5rem;
            display: block;
            position: absolute;
            overflow: hidden;
            border-radius: 0.2rem;
            background-color: #fff;
            border: 0.25rem solid transparent;
            border-radius: 0.5rem;
            &:nth-child(1) {
              left: 3%;
              top: 1.1rem;
            }
            &:nth-child(2) {
              left: 35%;
              top: 1.1rem;
            }
            &:nth-child(3) {
              left: 67%;
              top: 1.1rem;
            }
            &:nth-child(4) {
              left: 67%;
              top: 6.9rem;
            }
            &:nth-child(5) {
              left: 67%;
              top: 12.7rem;
            }
            &:nth-child(6) {
              left: 35%;
              top: 12.7rem;
            }
            &:nth-child(7) {
              left: 3%;
              top: 12.7rem;
            }
            &:nth-child(8) {
              left: 3%;
              top: 6.9rem;
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
                  height: 2.7rem;
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
          .getLuck {
            width: 30%;
            height: 5.5rem;
            border-radius: 0.2rem;
            text-align: center;
            position: absolute;
            top: 6.9rem;
            left: 35%;
            background-size: 100% 5.5rem;
            font-size: 1.2rem;
            font-weight: bold;
            line-height: 5.5rem;
            color: #fff;
            background-image: url('~@/assets/img/vote/TeamFission/bg-start.png');
            &:active {
              background-image: url('~@/assets/img/vote/TeamFission/bg-start.png');
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
