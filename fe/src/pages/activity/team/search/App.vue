<template>
  <div class="wrapper">
    <mBanner />
    <div>
      <!-- TODO search -->
    </div>
  </div>
</template>
<script>
import mBanner from '@/pages/activity/team/banner.vue'
// import { searchTeam, joinTeam, createTeam } from '@/pages/activity/team/func'
export default {
  components: {
    mBanner
  },
  data() {
    return {
      // 页面
      appType: this.$appType,
      isLogin: this.$isLogin,
      user_id: this.$user.id,
      imgUrl: 'http://cdn.startimestv.com/banner/BSSVote2-banner.png',
      shareTitle: 'Bongo Star Search 2019',
      shareText: 'Saidia mshiriki wako unayempenda kurudi kwenye show!'
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
    // this.mSendEvLog("page_show", "", "");
  },
  methods: {}
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
  background-color: #7c003d;
  .box {
    position: relative;
    z-index: 2;
    width: 90%;
    margin: 0 auto;
    font-style: italic;
    .title {
      background-image: linear-gradient(rgba(189, 4, 78, 0.5), rgba(165, 3, 80, 0.5));
      width: 85%;
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
    margin: -18% auto 0;
    height: 9rem;
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
    height: 9rem;
  }
  .lottery {
    height: 22rem;
  }
}
</style>
