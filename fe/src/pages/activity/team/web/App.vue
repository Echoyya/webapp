<template>
  <div class="wrapper">
    <mBanner />
    <div
      v-if="mumberList.length<3"
      class="text text0"
      v-html="$t('vote.team.invite_tip',[leader_name])"
    ></div>
    <div v-else class="text text1">{{$t('vote.team.full_team')}}</div>
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
      <div v-show="mumberList.length>=3" class="team-btn">
        <div @click="callOrDownApp('new')">{{$t('vote.team.form_newbtn')}}</div>
      </div>
      <div v-show="mumberList.length>=1&&mumberList.length<3" class="team-btn">
        <div @click="callOrDownApp('join')">
          <div>{{$t('vote.team.join_s')}}</div>
        </div>
      </div>
      <div v-show="mumberList.length>=1&&mumberList.length<3" class="copy">
        <div>Team ID:</div>
        <div id="teamno">{{teamNum}}</div>
        <div id="copy" data-clipboard-target="#teamno">{{$t('vote.team.copy_text')}}</div>
      </div>
    </div>
    <div v-show="moreList1.length>0" class="text text2">{{$t('vote.team.follow_team')}}</div>
    <div v-show="moreList1.length>0" class="more-team">
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
          <div class="join" @click="callOrDownApp('first')">
            <div>{{$t('vote.team.join_s')}}</div>
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
          <div class="join" @click="callOrDownApp('second')">
            <div>{{$t('vote.team.join_s')}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="text text3" v-html="$t('vote.team.invite_infotit')"></div>
    <div class="video">
      <div class="item"></div>
    </div>
    <confirm-dialog ref="confirm" />
    <toast-dialog ref="toast" />
    <malert ref="malert" />
  </div>
</template>
<script>
import mBanner from '@/pages/activity/team/banner.vue'
import { formatAmount } from '@/functions/utils'
import { searchTeam } from '@/pages/activity/team/func'
import { getQuery, callApp, callMarket, downApk } from '@/functions/app'
import confirmDialog from '@/components/confirm'
import malert from '@/pages/activity/team/malert'
import ClipboardJS from 'clipboard'
import toastDialog from '@/components/toast'
export default {
  components: {
    mBanner,
    confirmDialog,
    toastDialog,
    malert
  },
  data() {
    return {
      activity_id: getQuery('activiy') || 1,
      activityStart: 0,
      activityEnd: 0,

      mumberList: [],
      moreList1: [],
      moreList2: [],
      teamNum: '',
      teamNum1: '',
      teamNum2: '',
      number: '',
      leader_name: 'leader_name'
    }
  },
  created() {
    this.$axios.get(`/voting/team-building/v1/activity-info?team_activity_id=${this.activity_id}`).then(({ data }) => {
      if (data.code == 0) {
        this.activityStart = data.data.start_date
        this.activityEnd = data.data.end_date
        const during = Math.floor((this.activityEnd - this.activityStart) / 1000)
        const max = 10 * 10000
        const speed = Math.floor((max / during) * 100) / 100
        const period = Math.floor((this.$serverTime - this.activityStart) / 1000)
        this.number = formatAmount(10 + Math.floor(period * speed))
      }
    })

    this.teamNum = getQuery('teamno')
    if (this.teamNum) {
      this.search()
    }
  },
  mounted() {
    this.$nextTick(() => {
      const clipboard = new ClipboardJS('#copy')
      clipboard.on('success', e => {
        this.$refs.toast.show(this.$t('vote.team.copied'))
        e.clearSelection()
      })

      clipboard.on('error', () => {
        this.$refs.toast.show('Copy is not supported on your browser, please try to make a long press to copy')
      })
    })
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
    callOrDownApp(value) {
      let url = ''
      if (value == 'first') {
        this.mSendEvLog('joinbtn_click', 'h5recommend', '1')
        this.mSendEvLog('callApp', 'jointeamfull', '1')
        url = '&teamno=' + this.teamNum1
      } else if (value == 'second') {
        this.mSendEvLog('joinbtn_click', 'h5recommend', '1')
        this.mSendEvLog('callApp', 'jointeamfull', '1')
        url = '&teamno=' + this.teamNum2
      } else if (value == 'join') {
        this.mSendEvLog('callApp', 'jointeam', '1')
        url = '&teamno=' + this.teamNum
      } else {
        this.mSendEvLog('callApp', 'formnew', '1')
        this.mSendEvLog('teamoverpage_formnew', '', '1')
      }

      const loadURl = window.location.origin + '/activity/team/home.html?activity=' + this.activity_id + url
      callApp.call(this, `com.star.mobile.video.activity.BrowserActivity?loadUrl=${encodeURIComponent(loadURl)}`, () => {
        callMarket.call(this, () => {
          if (value == 'join') this.mSendEvLog('downloadpopup_show', 'jointeam', '1')
          else if (value == 'first' || value == 'second') this.mSendEvLog('downloadpopup_show', 'jointeamfull', '1')
          else this.mSendEvLog('downloadpopup_show', 'formnew', '1')
          this.$refs.confirm.show(
            this.$t('vote.team.download_tip'),
            () => {
              if (value == 'join') this.mSendEvLog('downloadpopup_clickok', 'jointeam', '1')
              else if (value == 'first' || value == 'second') this.mSendEvLog('downloadpopup_clickok', 'jointeamfull', '1')
              else this.mSendEvLog('downloadpopup_clickok', 'formnew', '1')
              downApk.call(this)
            },
            () => {
              if (value == 'join') this.mSendEvLog('downloadpopup_clicknot', 'jointeam', '1')
              else if (value == 'first' || value == 'second') this.mSendEvLog('downloadpopup_clicknot', 'jointeamfull', '1')
              else this.mSendEvLog('downloadpopup_clicknot', 'formnew', '1')
            },
            'OK',
            'NOT NOW'
          )
        })
      })
    },
    search() {
      searchTeam.call(this, this.teamNum, data => {
        console.log(data.code)
        if (data.code == 1 || data.code == 0) {
          this.mumberList = data.data.team_member_dtos
          this.leader_name = this.mumberList[0].nick_name
          if (data.code == 1) {
            this.mSendEvLog('teaminvpage_show', '', '1')
          }
          if (data.code == 0) {
            this.mSendEvLog('teamfullpage_show', '', '1')
            this.teamNum1 = data.data.team_recommend_dtos[0] ? data.data.team_recommend_dtos[0].team_no : 0
            this.teamNum2 = data.data.team_recommend_dtos[1] ? data.data.team_recommend_dtos[1].team_no : 0
            this.moreList1 = data.data.team_recommend_dtos[0] ? data.data.team_recommend_dtos[0].team_member_dtos : []
            this.moreList2 = data.data.team_recommend_dtos[1] ? data.data.team_recommend_dtos[1].team_member_dtos : []
          }
        } else if (data.code == 2) {
          this.$refs.malert.show(this.$t('vote.team.search_nores'))
        } else {
          this.$refs.malert.show('Unknown error')
        }
      })
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
  padding-bottom: 1rem;
  .text {
    width: 95%;
    position: relative;
    height: 1.7rem;
    line-height: 1.7rem;
    font-size: 0.8rem;
    padding-left: 0.5rem;
    color: #fff;
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
    background-color: #c20044;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #ffbc00;
    font-weight: bold;
    &.text0 {
      height: 3.4rem;
      margin: -18% auto 0;
      text-align: center;
    }
    &.text1 {
      margin: -18% auto 0;
    }
    &.text2 {
      margin: 0.5rem auto 0;
    }
    &.text3 {
      height: 1.7rem;
      margin: 0.5rem auto 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
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
        span {
          img {
            width: 65%;
            margin: 0 auto;
            border: 2px solid #8600c8;
            border-radius: 100%;
            display: block;
          }
        }
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
        font-size: 0.75rem
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
  .video {
    width: 95%;
    margin: 0 auto;
    position: relative;
    background-image: linear-gradient(#8e0044, #3c0003);
    padding: 0 2.5% 0.5rem;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
    .item {
      position: relative;
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
      background-image: url('~@/assets/img/vote/TeamFission/down-banner.png');
      background-size: 100% 100%;
      &:before {
        content: '';
        display: inline-block;
        padding-bottom: 57%;
        width: 0;
        vertical-align: middle;
      }
    }
  }
}
</style>
