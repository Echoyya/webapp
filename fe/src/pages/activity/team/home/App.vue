<template>
  <div class="wrapper">
    <mBanner />
    <div class="remaining box">
      <div class="title">Remaining:</div>
      <div class="times">
        <div class="day">{{days}} days</div>
        <div class="day">
          <div>{{hour}} h</div>
          <div>{{min}} m</div>
          <div>{{sed}} s</div>
        </div>
      </div>
    </div>
    <div class="invite box">
      <div class="title">Remaining:</div>
      <div class="times">
        <div class="day">{{days}} days</div>
        <div class="day">
          <div>{{hour}} h</div>
          <div>{{min}} m</div>
          <div>{{sed}} s</div>
        </div>
      </div>
    </div>
    <div class="lottery box">
      <div class="title">Remaining:</div>
      <div class="times">
        <div class="day">{{days}} days</div>
        <div class="day">
          <div>{{hour}} h</div>
          <div>{{min}} m</div>
          <div>{{sed}} s</div>
        </div>
      </div>
    </div>
    <mShare ref="share" />
    <alert-dialog ref="alert" />
    <confirm-dialog ref="confirm" />
    <toast-dialog ref="toast" />
  </div>
</template>
<script>
// import qs from "qs";
import alertDialog from '@/components/alert'
import confirmDialog from '@/components/confirm'
import toastDialog from '@/components/toast'
import mShare from '@/components/web/share.vue'
import mBanner from '@/pages/activity/team/banner.vue'
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

      // remaining
      days: '1000000',
      hour: '24',
      min: '59',
      sed: '59',
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
      lottery_id: 3,
      lotteryType: [],

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
  background-color: #7C003D;
  .box {
    position: relative;
    z-index: 2;
    width: 90%;
    height: 9rem;
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
    .times {
      padding: 0.5rem;
      background-image: linear-gradient(rgba(165, 3, 80, 0.5), #600165);
      border-radius: 1rem;
      border-top-left-radius: 0;
      color: #fff;
      .day {
        width: 100%;
        height: 2.5rem;
        line-height: 2.5rem;
        background-image: url('~@/assets/img/vote/TeamFission/bg-remain.png');
        background-size: 100% 2.5rem;
        text-align: center;
        &:first-child {
          margin-bottom: 0.5rem;
        }
        div {
          display: inline-block;
        }
      }
    }
  }
  .remaining {
    margin: -18% auto 1rem;
  }
}
</style>
