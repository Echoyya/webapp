<template>
  <div class="wrapper">
    <mBanner />
    <div class="remaining box">
      <img src="@/assets/img/vote/TeamFission/ic-awards.png" @click="showAwards" />
      <div class="title">Remaining:</div>
      <div class="contant">
        <div class="day">
          <span>{{days | formatAmount}}</span> days
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
    <div class="invite box">
      <div class="title">Invite two friends to draw a lottery:</div>
      <div class="contant">
        <div>
          <div>
            <img :src="team.team_member_dtos[0].logo" alt />
          </div>
          <span>{{team.team_member_dtos[0].nick_name}}</span>
        </div>
        <img src="@/assets/img/vote/TeamFission/ic_forward2.png" alt />
        <div>
          <div>
            <img v-if="team.team_recommend_dtos[0].team_member_dtos[0]" :src="team.team_recommend_dtos[0].team_member_dtos[0].logo" alt />
          </div>
        </div>
        <div>
          <div>
            <img v-if="team.team_recommend_dtos[0].team_member_dtos[1]" :src="team.team_recommend_dtos[0].team_member_dtos[1].logo" alt />
          </div>
        </div>
      </div>
    </div>
    <div class="lottery box">
      <div class="title">Draw your prize!</div>
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
            <div class="getLuck" @click="startLottery">DRAW</div>
          </ul>
        </div>
      </div>
    </div>
    <div class="msg-box">
      <div class="msg">
        <ul ref="msgul" :class="{anim:animates==true}">
          <img src="@/assets/img/vote/BSSRegister/sound.png" alt />
          <li
            v-for="item in msgList"
            :key="item.key"
          >{{item.nick_name?item.nick_name:(item.user_name?item.user_name:item.user_id)}} has won {{item.reward_name||''}}!</li>
        </ul>
      </div>
    </div>

    <mShare ref="share" />
    <alert-dialog ref="alert" />
    <confirm-dialog ref="confirm" />
    <toast-dialog ref="toast" />
  </div>
</template>
<script>
import alertDialog from '@/components/alert'
import confirmDialog from '@/components/confirm'
import toastDialog from '@/components/toast'
import mShare from '@/components/web/share.vue'
import mBanner from '@/pages/activity/team/banner.vue'
import { formatAmount } from '@/functions/utils'
export default {
  components: {
    mBanner,
    mShare,
    alertDialog,
    confirmDialog,
    toastDialog
  },
  data() {
    return {
      // 页面
      appType: this.$appType,
      isLogin: this.$isLogin,
      user_id: this.$user.id,
      imgUrl: 'http://cdn.startimestv.com/banner/BSSVote2-banner.png',
      shareTitle: 'Bongo Star Search 2019',
      shareText: 'Saidia mshiriki wako unayempenda kurudi kwenye show!',

      activityStart: new Date('2019-11-05 00:00:00').getTime(),
      activityEnd: new Date('2019-11-18 04:00:00').getTime(),
      // remaining
      days: '1000000',
      hour: '',
      min: '',
      sed: '',

      //team
      team: {
        allow_lottery: true,
        team_member_dtos: [
          {
            nick_name: 'leader',
            logo: 'http://cdn.startimestv.com/banner/bss-more.png'
          }
        ],
        joined: true,
        team_recommend_dtos: [
          {
            team_no: 'string',
            team_member_dtos: [
              {
                nick_name: 'name1',
                logo: 'http://cdn.startimestv.com/banner/bss-more.png'
              }
            ]
          }
        ]
      },
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
      lottery_id: 4,
      lotteryType: [],
      loaded_l: false,

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
  filters: {
    formatAmount(val) {
      return formatAmount(val)
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
    // this.mSendEvLog("page_show", "", "");
    this.getLotteryType()
    this.getMsgList()
    this.msgScroll()
  },
  methods: {
    showAwards() {
      console.log('my awards')
    },
    // 获取消息列表
    getMsgList() {
      this.$axios
        .get(`/voting/lottery/v1/winnings?lottery_id=${this.lottery_id}`)
        .then(res => {
          if (res.data.code === 0) {
            // if (this.$serverTime <= this.startTime) {
            //   this.items = [];
            // } else {
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
            // }
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
    msgScroll() {
      this.tmsg = setInterval(() => {
        // if (this.$serverTime > this.endTime) clearInterval(this.tmsg)
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
            this.$refs.alert.show('Get rewards error!')
          }
          this.loaded_l = true
          // this.getMsgList();
        })
        .catch(err => {
          this.lotteryType = []
          this.$refs.alert.show('Get rewards error!! ' + err)
        })
    },
    startLottery() {
      console.log('start')
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
  .remaining {
    margin: -18% auto 1rem;
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
        color: #dddddd;
        span {
          font-size: 1.3rem;
          font-weight: bold;
          letter-spacing: 0.15rem;
          color: white;
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
  .invite {
    margin-bottom: 1rem;
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
