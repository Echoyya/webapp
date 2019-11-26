<template>
  <div class="wrapper">
    <mBanner />
    <countdown :teamNo="teamNum" :activityStart="activityStart" :activityEnd="activityEnd" />
    <div class="prize">
      <img v-if="award_day==1" src="@/assets/img/vote/TeamFission/vip1.png" alt />
      <img v-if="award_day==7" src="@/assets/img/vote/TeamFission/vip7.png" alt />
      <img v-if="award_day==30" src="@/assets/img/vote/TeamFission/vip30.png" alt />
      <img v-if="award_day==0" src="@/assets/img/vote/TeamFission/thanks.png" alt />
    </div>
    <div class="share-box" v-show="show_share">
      <img src="@/assets/img/vote/TeamFission/ic_voice.png" />
      <div class="text">{{$t('vote.team.show_lucky')}}</div>
      <img src="@/assets/img/vote/TeamFission/ic_close.png" class="close" @click="show_share=false" />
      <img src="@/assets/img/vote/TeamFission/ic-facebook.png" @click="toFacebook" />
      <img src="@/assets/img/vote/TeamFission/ic_WhatsApp.png" @click="toWhatsApp" />
      <img src="@/assets/img/vote/TeamFission/ic_xender.png" @click="toXender" />
      <img src="@/assets/img/vote/TeamFission/ic-copylink.png" @click="toCopylink" />
      <div class="name">
        <span>{{$t('vote.team.facebook')}}</span>
        <span>{{$t('vote.team.whatsapp')}}</span>
        <span>{{$t('vote.team.xender')}}</span>
        <span>{{$t('vote.team.copy')}}</span>
      </div>
    </div>
    <div class="share-btn" v-show="!show_share">
      <div class="friends" @click="showShare">
        <img src="@/assets/img/vote/TeamFission/ic_voice.png" />
        <p>{{$t('vote.team.show_lucky')}}</p>
      </div>
    </div>
    <div class="team-btn">
      <div @click="create">{{$t('vote.team.form_newbtn')}}</div>
    </div>
    <div class="tip">
      <div class="text" v-html="$t('vote.team.tips')"></div>
    </div>
  </div>
</template>
<script>
import mBanner from '@/pages/activity/team/banner.vue'
import { shareByFacebook, shareByWhatsApp, shareByXender, shareByCopyLink, getQuery, shareInvite } from '@/functions/app'
import countdown from '@/pages/activity/team/countdown'
export default {
  components: {
    mBanner,
    countdown
  },
  data() {
    return {
      activity_id: getQuery('activity') || 1,
      activityStart: 0,
      activityEnd: 0,
      imgUrl: 'http://cdn.startimestv.com/banner/team-banner.png',
      shareTitle: this.$t('vote.team.shareTitle'),
      shareText: this.$t('vote.team.invite_con'),
      shareWebUrl: '',
      shareShowoffUrl: '',

      teamNum: '',
      show_share: false,
      award_day: ''
    }
  },
  created() {
    this.teamNum = getQuery('teamno')
    this.award_day = getQuery('prize')
    if (this.award_day) window.getChannelId && window.getChannelId.updateOttInfo && window.getChannelId.updateOttInfo()
    this.shareWebUrl = `${window.location.origin}/activity/team/web.html?activity=${this.activity_id}&teamno=${this.teamNum}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`
    this.shareShowoffUrl = `${window.location.origin}/activity/team/showoff.html?activity=${this.activity_id}&prize=${this.award_day}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`
    this.$axios.get(`/voting/team-building/v1/activity-info?team_activity_id=${this.activity_id}`).then(({ data }) => {
      if (data.code == 0) {
        this.activityStart = data.data.start_date
        this.activityEnd = data.data.end_date
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
    create() {
      window.location.href = `/activity/team/home.html?activity=${this.activity_id}`
    },
    showShare() {
      if (this.$appVersion) {
        // 5.20版本
        this.show_share = true
      } else {
        shareInvite(this.shareShowoffUrl, this.shareTitle, this.shareText, this.imgUrl)
      }
    },
    toFacebook() {
      this.mSendEvLog('sharelucky_click', 'Facebook', '1')
      if (this.$appType == 1) {
        shareByFacebook(this.shareShowoffUrl, `【${this.shareTitle}】 ${this.shareText} `)
      }
    },
    toWhatsApp() {
      this.mSendEvLog('sharelucky_click', 'WhatsApp', '1')
      if (this.$appType == 1) {
        shareByWhatsApp(this.shareShowoffUrl, this.shareTitle, this.shareText, this.imgUrl)
      }
    },
    toXender() {
      this.mSendEvLog('sharelucky_click', 'Xender', '1')
      if (this.$appType == 1) {
        shareByXender(this.teamNum,'awards')
      }
    },
    toCopylink() {
      this.mSendEvLog('sharelucky_click', 'copylink', '1')
      if (this.$appType == 1) {
        shareByCopyLink(this.shareShowoffUrl)
      }
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
    }
    .contant {
      padding: 0.5rem;
      background-image: linear-gradient(rgba(165, 3, 80, 0.5), #600165);
      border-radius: 1rem;
      border-top-left-radius: 0;
      color: #fff;
    }
  }
  .prize {
    width: 95%;
    margin: 0 auto;
    border-radius: 1rem;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .share-btn {
    .friends {
      width: 90%;
      height: 4rem;
      position: relative;
      background: #600049;
      border-radius: 2rem;
      color: #ffffff;
      margin: 0 auto;
      padding-top: 0.4rem;
      img {
        height: 1.8rem;
        position: absolute;
        left: 7%;
        top: 1rem;
      }
      p {
        width: 78%;
        height: 3rem;
        line-height: 3rem;
        text-align: left;
        padding-left: 17%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-color: #94013f;
        border-radius: 2rem;
        border: 0.1rem solid #ff9800;
        margin: 0 auto;
      }
    }
  }
  .share-box {
    width: 95%;
    margin: 0.5rem auto;
    padding: 0.5rem;
    background-color: #a1014b;
    border-radius: 1rem;
    position: relative;
    .close {
      width: 2rem;
      height: 2rem;
      position: absolute;
      right: 0.5rem;
      top: 0.5rem;
    }
    > img {
      width: 25%;
      &:nth-child(1) {
        width: 2rem;
        height: 2rem;
        position: absolute;
        left: 5%;
        top: 0.5rem;
      }
    }
    .text {
      width: 100%;
      height: 2rem;
      line-height: 2rem;
      margin: 0 auto;
      color: #fff;
      padding-left: 15%;
      margin-bottom: 1rem;
    }
    .name {
      span {
        display: inline-block;
        width: 25%;
        vertical-align: top;
        text-align: center;
        line-height: 1rem;
        font-size: 0.75rem;
        color: #fff;
      }
    }
  }
  .team-btn {
    width: 85%;
    margin: 0.5rem auto;
    text-align: center;
    span {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
    }
    div {
      background: linear-gradient(180deg, rgba(253, 94, 0, 1) 0%, rgba(250, 0, 67, 1) 100%);
      border-radius: 25px;
      border: 0.25rem solid rgba(26, 1, 96, 0.75);
      color: #ffffff;
      height: 2.75rem;
      line-height: 2.25rem;
      margin-top: 0.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .tip {
    width: 100%;
    padding-bottom: 1rem;
    .text {
      background-color: rgba(0, 0, 0, 0.5);
      margin: 1rem auto 0;
      border-radius: 1rem;
      width: 95%;
      padding: 1rem;
      color: #fff;
    }
  }
}
</style>
