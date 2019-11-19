<template>
  <div class="wrapper">
    <mBanner />
    <countdown :teamNo="teamNum" :activityStart="activityStart" :activityEnd="activityEnd" />
    <div class="prize">
      <img v-if="award_day==1" src="@/assets/img/vote/TeamFission/vip1.png" alt="">
      <img v-if="award_day==7" src="@/assets/img/vote/TeamFission/vip7.png" alt="">
      <img v-if="award_day==30" src="@/assets/img/vote/TeamFission/vip30.png" alt="">
      <img v-if="award_day==0" src="@/assets/img/vote/TeamFission/thanks.png" alt="">
    </div>
    <div class="share-box">
      <img src="@/assets/img/vote/TeamFission/ic_voice.png" />
      <div class="text">{{$t('vote.team.show_lucky')}}</div>
      <img src="@/assets/img/vote/TeamFission/ic-facebook.png" @click="toFacebook" />
      <img src="@/assets/img/vote/TeamFission/ic_WhatsApp.png" @click="toWhatsApp" />
      <img src="@/assets/img/vote/TeamFission/ic_xender.png" @click="toXender" />
      <img src="@/assets/img/vote/TeamFission/ic-copylink.png" @click="toCopylink" />
    </div>
    <div class="team-btn">
      <div @click="create">{{$t('vote.team.form_newbtn')}}</div>
    </div>
    <div class="tip">
      <div class="text" v-html="$t('vote.team.tips',[award_day])"></div>
    </div>
  </div>
</template>
<script>
import mBanner from '@/pages/activity/team/banner.vue'
import { shareByFacebook, shareByWhatsApp, shareByXender, shareByCopyLink, getQueryVariable, shareInvite } from '@/functions/app'
import countdown from '@/pages/activity/team/countdown'
export default {
  components: {
    mBanner,
    countdown
  },
  data() {
    return {
      // 页面
      imgUrl: 'http://cdn.startimestv.com/banner/BSSVote2-banner.png',
      shareTitle: this.$t('vote.team.shareTitle'),
      shareText: this.$t('vote.team.invite_con'),
      prize: 1,
      text: [this.$t('vote.team.congrats'), this.$t('vote.team.solucky'), this.$t('vote.team.jackpot')],
      award_day: '',

      activityStart: new Date('2019-11-15 00:00:00').getTime(),
      activityEnd: new Date('2019-11-25 04:00:00').getTime(),
      //team
      teamNum: '',
      team_activity_id: 1
    }
  },
  mounted() {
    this.teamNum = getQueryVariable(location.search.replace('?', ''), 'teamno')
    this.award_day = getQueryVariable(location.search.replace('?', ''), 'prize')
    if (this.award_day == 1) this.prize = 1
    else if (this.award_day == 7) this.prize = 2
    else if (this.award_day == 30) this.prize = 3
  },
  methods: {
    create() {
      window.location.href = '/activity/team/home.html'
    },
    shareOldVersion() {
      shareInvite(
        `${window.location.origin}/activity/team/web.html?teamno=${this.teamNum}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`,
        this.shareTitle,
        this.shareText,
        this.imgUrl
      )
    },
    toFacebook() {
      if (this.$appType == 1) {
        if (this.$appVersion) {
          shareByFacebook(
            `${window.location.origin}/activity/team/showoff.html?prize=${this.award_day}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`,
            this.shareTitle,
            this.shareText,
            this.imgUrl
          )
        } else {
          this.shareOldVersion()
        }
      }
    },
    toWhatsApp() {
      if (this.$appType == 1) {
        if (this.$appVersion) {
          shareByWhatsApp(
            `${window.location.origin}/activity/team/showoff.html?prize=${this.award_day}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`,
            this.shareTitle,
            this.shareText,
            this.imgUrl
          )
        } else {
          this.shareOldVersion()
        }
      }
    },
    toXender() {
      if (this.$appType == 1) {
        if (this.$appVersion) {
          shareByXender(this.teamNum)
        } else {
          this.shareOldVersion()
        }
      }
    },
    toCopylink() {
      if (this.$appType == 1) {
        if (this.$appVersion) {
          shareByCopyLink(
            `${window.location.origin}/activity/team/showoff.html?prize=${this.award_day}&utm_source=VOTE&utm_medium=team&utm_campaign=${this.$platform}`
          )
        } else {
          this.shareOldVersion()
        }
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
  .prize {
    width: 95%;
    margin: 0 auto;
    border-radius: 1rem;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .share-box {
    width: 95%;
    margin: 0.5rem auto;
    padding: 0.5rem;
    background-color: #a1014b;
    // height: 10rem;
    border-radius: 1rem;
    position: relative;
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
    > div {
      width: 100%;
      height: 2rem;
      line-height: 2rem;
      margin: 0 auto;
      color: #fff;
      padding-left: 15%;
      margin-bottom: 1rem;
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
