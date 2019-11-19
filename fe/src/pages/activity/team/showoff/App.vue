<template>
  <div class="wrapper">
    <mBanner />
    <div class="prize">
      <img v-if="award_day==1" src="@/assets/img/vote/TeamFission/vip1.png" alt />
      <img v-if="award_day==7" src="@/assets/img/vote/TeamFission/vip7.png" alt />
      <img v-if="award_day==30" src="@/assets/img/vote/TeamFission/vip30.png" alt />
      <img v-if="award_day==0" src="@/assets/img/vote/TeamFission/thanks.png" alt />
    </div>
    <div class="text2" v-html="$t('vote.team.invite_infotit')"></div>
    <div class="video">
      <div class="item">
        <div class="video-item">
          <p>GAMES</p>
          <img src="@/assets/img/vote/TeamFission/verline.png" alt />
          <img src="@/assets/img/vote/TeamFission/verline2.png" alt />
        </div>
        <div class="video-item">
          <p>SERIES</p>
          <img src="@/assets/img/vote/TeamFission/verline.png" alt />
          <img src="@/assets/img/vote/TeamFission/verline2.png" alt />
        </div>
        <div class="video-item">
          <p>VARIETY</p>
          <img src="@/assets/img/vote/TeamFission/verline2.png" alt />
        </div>
        <div class="video-item">
          <p>KIDS</p>
          <img src="@/assets/img/vote/TeamFission/verline.png" alt />
        </div>
        <div class="video-item">
          <p>MOVIE</p>
          <img src="@/assets/img/vote/TeamFission/verline.png" alt />
        </div>
        <div class="video-item">
          <p>DVB</p>
        </div>
      </div>
      <div class="img"></div>
    </div>
    <div class="team-btn">
      <div @click="callOrDownApp">{{$t('vote.team.download_join')}}</div>
    </div>
  </div>
</template>
<script>
import mBanner from '@/pages/activity/team/banner.vue'
import { getQueryVariable, callApp, callMarket, downApk } from '@/functions/app'
export default {
  components: {
    mBanner
  },
  data() {
    return {
      // 页面
      award_day: '',

      activityStart: new Date('2019-11-15 00:00:00').getTime(),
      activityEnd: new Date('2019-11-25 04:00:00').getTime()
    }
  },
  computed: {
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
  mounted() {
    this.award_day = getQueryVariable(location.search.replace('?', ''), 'prize')
  },
  methods: {
    create() {
      window.location.href = '/activity/team/home.html'
    },
    callOrDownApp() {
      callApp.call(this, `com.star.mobile.video.activity.BrowserActivity?loadUrl=${window.location.origin}/activity/team/home.html`, () => {
        callMarket.call(this, () => {
          this.$refs.confirm.show(
            this.$t('vote.team.download_tip'),
            () => {
              downApk.call(this)
            },
            () => {},
            'OK',
            'NOT NOW'
          )
        })
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
  min-height: 100vh;
  .prize {
    width: 95%;
    margin: -18% auto 0;
    border-radius: 1rem;
    overflow: hidden;
    position: relative;
    z-index: 2;
    img {
      width: 100%;
    }
  }
  .text2 {
    width: 95%;
    position: relative;
    height: 3.4rem;
    line-height: 1.7rem;
    font-size: 0.8rem;
    padding-left: 0.5rem;
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
    background-color: #c20044;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin: 0.5rem auto 0;
    text-align: center;
    color: #FFBC00;
    font-weight: bold;
  }
  .video {
    width: 95%;
    height: 8.5rem;
    margin: 0 auto;
    position: relative;
    background-image: linear-gradient(rgba(234, 4, 4, 0.3), rgba(57, 3, 157, 0.5));
    padding: 0 2.5%;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
    .item {
      position: relative;
      z-index: 2;
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
      overflow: hidden;
      .video-item {
        position: relative;
        display: inline-block;
        width: 33.3%;
        height: 4rem;
        line-height: 4rem;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.5);
        p {
          color: #fff;
        }
        img:nth-child(2) {
          position: absolute;
          width: 0.05rem;
          height: 1.2rem;
          top: 1.4rem;
          right: 0;
        }
        img:nth-child(3) {
          width: 1.2rem;
          height: 0.05rem;
          position: absolute;
          left: 42%;
          bottom: 0;
        }
        &:nth-child(3) {
          img:nth-child(2) {
            width: 1.2rem;
            height: 0.05rem;
            position: absolute;
            left: 42%;
            top: 3.95rem;
            bottom: 0;
          }
        }
      }
    }
    .img {
      width: 94%;
      height: 8rem;
      position: absolute;
      left: 3%;
      top: 0;
      background-image: url('~@/assets/img/vote/TeamFission/bg-banner.png');
      background-size: cover;
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
    }
  }
  .team-btn {
    width: 85%;
    margin: 0.5rem auto 0;
    padding-bottom: 0.5rem;
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
}
</style>
