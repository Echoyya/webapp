<template>
  <div class="wrapper">
    <mBanner />
    <div v-if="have_no_result" class="no-result">{{$t('vote.team.no_awards')}}</div>
    <div v-if="!have_no_result" v-show="!show_share" class="invite">
      <div v-if="allDays>1" class="title">{{$t('vote.team.my_won',[allDays])}}</div>
      <div v-if="allDays<=1" class="title">{{$t('vote.team.my_won_one',[allDays])}}</div>
      <div class="contant">
        <div v-show="teams.length>0" v-for="(item,index) in teams" :key="index" class="items">
          <div>
            <div>
              <img v-if="item.team_member_dtos[0].logo" :src="item.team_member_dtos[0].logo" alt />
              <img v-else src="http://cdn.startimestv.com/head/h_d.png" />
            </div>
          </div>
          <img src="@/assets/img/vote/TeamFission/ic_forward2.png" />
          <div>
            <div>
              <img
                v-if="item.team_member_dtos[1]&&item.team_member_dtos[1].logo"
                :src="item.team_member_dtos[1].logo"
              />
              <img v-else src="http://cdn.startimestv.com/head/h_d.png" />
            </div>
          </div>
          <div>
            <div>
              <img
                v-if="item.team_member_dtos[2]&&item.team_member_dtos[2].logo"
                :src="item.team_member_dtos[2].logo"
              />
              <img v-else src="http://cdn.startimestv.com/head/h_d.png" />
            </div>
          </div>
          <div v-if="item.my_award_day==0" class="vip">THANKS</div>
          <div v-if="item.my_award_day==1" class="vip">VIP {{item.my_award_day}} DAY</div>
          <div
            v-if="item.my_award_day!=0&&item.my_award_day!=1"
            class="vip"
          >VIP {{item.my_award_day}} DAYS</div>
        </div>
      </div>
      <div class="friends" @click="showShare">
        <img src="@/assets/img/vote/TeamFission/ic_share.png" />
        <p>{{$t('vote.team.invite_btn',[allDays])}}</p>
      </div>
    </div>
    <div v-if="!have_no_result" v-show="show_share" class="share-box">
      <img src="@/assets/img/vote/TeamFission/ic_close.png" @click="show_share=false" />
      <img src="@/assets/img/vote/TeamFission/ic-facebook.png" @click="toFacebook" />
      <img src="@/assets/img/vote/TeamFission/ic_WhatsApp.png" @click="toWhatsApp" />
      <img src="@/assets/img/vote/TeamFission/ic_xender.png" @click="toXender" />
      <img src="@/assets/img/vote/TeamFission/ic_download.png" @click="toDownload" />
      <img src="@/assets/img/vote/TeamFission/ic-copylink.png" @click="toCopylink" />
    </div>
  </div>
</template>
<script>
import mBanner from '@/pages/activity/team/banner.vue'
import { shareByFacebook, shareByWhatsApp, shareByXender, shareByCopyLink, shareInvite, getQuery } from '@/functions/app'
import { searchTeam } from '@/pages/activity/team/func'
export default {
  components: {
    mBanner
  },
  data() {
    return {
      activity_id: getQuery('activiy') || 1,
      show_share: false,
      imgUrl: 'http://cdn.startimestv.com/banner/BSSVote2-banner.png',
      shareTitle: this.$t('vote.team.shareTitle'),
      shareText: this.$t('vote.team.invite_con'),
      shareWebUrl: `${window.location.origin}/activity/team/web.html?activity=${this.activity_id}&teamno=${this.teamNum}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`,
      shareLandUrl: `${window.location.origin}/activity/team/land.html?activity=${this.activity_id}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`,

      teams: [],
      teamNum: '',
      allDays: 0,
      have_no_result: false
    }
  },
  created() {
    this.teamNum = getQuery('teamno')
    this.$axios.get(`/voting/team-award/v1/user/awards?team_activity_id=${this.activity_id}`).then(({ data }) => {
      if (data.code == 0) {
        this.teams = data.data.my_award_team_dtos
        this.allDays = data.data.all_award_days
      } else {
        this.have_no_result = true
      }
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
    shareOldVersion() {
      if (this.teams.length >= 10) {
        shareInvite(this.shareLandUrl, this.shareTitle, this.shareText, this.imgUrl)
      } else {
        shareInvite(this.shareWebUrl, this.shareTitle, this.shareText, this.imgUrl)
      }
    },
    showShare() {
      if (this.$appVersion) {
        this.show_share = true
        this.mSendEvLog('invitebtn_click', 'myprize', '1')
        this.mSendEvLog('myprize_inv_click', '', '1')
      }
      this.shareOldVersion()
    },
    toFacebook() {
      this.mSendEvLog('inviteway_click', 'Facebook', '1')
      if (this.$appType == 1) {
        if (this.teams.length >= 10) {
          shareByFacebook(this.shareLandUrl, `【${this.shareTitle}】 ${this.shareText} `)
        } else {
          shareByFacebook(this.shareWebUrl, `【${this.shareTitle}】 ${this.shareText} `)
        }
      }
    },
    toWhatsApp() {
      this.mSendEvLog('inviteway_click', 'WhatsApp', '1')
      if (this.$appType == 1) {
        if (this.teams.length >= 10) {
          shareByWhatsApp(this.shareLandUrl, this.shareTitle, this.shareText, this.imgUrl)
        } else {
          shareByWhatsApp(this.shareWebUrl, this.shareTitle, this.shareText, this.imgUrl)
        }
      }
    },
    toXender() {
      if(this.hasFinish) {
        this.mSendEvLog('inviteway_click', 'Xender', '0')
        this.$refs.malert.show('vote.team.share10_2')
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
      if(this.hasFinish) {
        this.mSendEvLog('inviteway_click', 'download', '0')
        this.$refs.malert.show('vote.team.share10_2')
        return
      }
      this.mSendEvLog('inviteway_click', 'download', '1')
      if (window.getChannelId && window.getChannelId.shareDownload) {
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
    },
    toCopylink() {
      this.mSendEvLog('inviteway_click', 'copylink', '1')
      if (this.$appType == 1) {
        if (this.teams.length >= 10) {
          shareByCopyLink(this.shareLandUrl)
        } else {
          shareByCopyLink(this.shareWebUrl)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.no-result {
  width: 93%;
  margin: 0 auto;
  background: linear-gradient(rgba(234, 4, 123, 0.3), rgba(57, 3, 157, 0.43));
  min-height: 18rem;
  border-radius: 5px;
  margin-top: -4rem;
  color: rgba(255, 117, 0, 1);
  font-size: 1.2rem;
  text-align: center;
  line-height: 18rem;
}
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
  .invite {
    position: relative;
    z-index: 2;
    width: 95%;
    margin: -18% auto 0;
    margin-bottom: 0.5rem;
    .title {
      background-image: linear-gradient(rgba(189, 4, 78, 0.5), rgba(165, 3, 80));
      width: 80%;
      height: 2rem;
      color: #ffbc00;
      border-top-right-radius: 1rem;
      border-top-left-radius: 1rem;
      padding-left: 0.8rem;
      line-height: 2rem;
    }
    .contant {
      background-image: linear-gradient(rgba(165, 3, 80), #600165);
      border-radius: 1rem;
      border-top-left-radius: 0;
      padding: 0.5rem 0.5rem 1.5rem;
      color: #fff;
      padding-top: 1rem;
      .items {
        position: relative;
        width: 65%;
        margin-left: 5%;
        margin-bottom: 0.5rem;
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
          margin-right: 3%;
        }
        :nth-child(2) {
          margin-right: 3%;
        }
        :nth-child(3) {
          margin-right: 5%;
        }
        > img {
          width: 15%;
          position: relative;
          top: -1.4rem;
        }
        .vip {
          position: absolute;
          right: -37%;
          top: 0.1rem;
          width: 5.5rem;
          height: 2.2rem;
          line-height: 2.1rem;
          font-size: 0.75rem;
          color: #ffbc00;
          text-align: center;
          background-color: #000;
          border: 0.05rem solid #ffbc00;
          border-radius: 1.1rem;
        }
      }
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
      margin-top: 0.5rem;
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
  .share-box {
    width: 95%;
    margin: -18% auto 0;
    padding: 0.5rem;
    background-color: #a1014b;
    height: 10rem;
    border-radius: 1rem;
    position: relative;
    z-index: 2;
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
}
</style>
