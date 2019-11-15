<template>
  <div class="wrapper">
    <mBanner />
    <div class="prize">
      <div class="text">{{text[prize-1]}}</div>
      <div class="vip">VIP {{award_day}} DAY</div>
    </div>
    <div class="text2">{{$t('vote.team.invite_infotit')}}</div>
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
      prize: 1,
      text: [this.$t('vote.team.congrats'), this.$t('vote.team.solucky'), this.$t('vote.team.jackpot')],
      award_day: '',

      activityStart: new Date('2019-11-05 00:00:00').getTime(),
      activityEnd: new Date('2019-11-18 04:00:00').getTime(),
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
    if (this.award_day == 1) this.prize = 1
    else if (this.award_day == 7) this.prize = 2
    else if (this.award_day == 30) this.prize = 3
  },
  methods: {
    create() {
      window.location.href = '/activity/team/home.html'
    },
    callOrDownApp() {
      callApp.call(
        this,
        `com.star.mobile.video.activity.BrowserActivity?loadUrl=${window.location.origin}/activity/team/home`,
        () => {
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
        }
      )
    },
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
    margin: -18% auto 0;
    background-color: rgba(50, 0, 25, 0.8);
    padding: 1rem 0.5rem 1.5rem;
    border-radius: 1rem;
    text-align: center;
    position: relative;
    .text {
      color: #fff;
      width: 100%;
      margin: 0 auto;
      height: 2rem;
      line-height: 2rem;
      margin-bottom: 1rem;
    }
    .vip {
      color: #ffbc00;
      margin: 0 auto;
      width: 50%;
      height: 3rem;
      line-height: 2.9rem;
      font-size: 1.2rem;
      font-weight: bold;
      border: 0.05rem solid #ffbc00;
      border-radius: 0.5rem;
      background-color: #000;
    }
  }
  .text2 {
    width: 95%;
    position: relative;
    height: 1.7rem;
    line-height: 1.7rem;
    font-size: 0.8rem;
    padding-left: 0.5rem;
    color: #fff;
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
    background-color: #ff3867;
    font-style: italic;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0.5rem auto 0;
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
