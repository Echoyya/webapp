<template>
  <div class="banner">
    <div class="top">
      <div class="img">
        <img src="@/assets/img/vote/TeamFission/ic_startimeson.png" alt="" class="icon">
        <img src="@/assets/img/vote/TeamFission/bg-banner.png" alt="bg-img" class="bg-img" />
      </div>
      <div class="about" @click="showRule">{{$t('vote.team.about_title')}}</div>
    </div>
    <div v-show="show_rules" class="rules-box">
      <img src="@/assets/img/vote/TeamFission/ic_close.png" alt @click="closeShadow" />
      <div class="rule-text">
        <p>{{$t('vote.team.about_title')}}</p>
        <div v-html="$t('vote.team.about_con')"></div>
      </div>
    </div>
    <div v-show="show_rules" class="shadow-box" @click="closeShadow"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 页面
      show_rules: false
    }
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
    showRule() {
      this.mSendEvLog("rulesbtn_click", "", "");
      this.show_rules = true
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.left = '0'
      document.body.style.right = '0'
    },
    closeShadow() {
      document.body.style.overflow = 'auto'
      document.body.style.position = 'static'
      this.show_rules = false
    }
  }
}
</script>

<style lang="less">
.banner {
  img,
  div,
  li {
    box-sizing: border-box;
  }
  width: 100%;
  // background-image: linear-gradient(#a90828, #930537, #7c003d);
  overflow: hidden;
  .top {
    width: 100%;
    position: relative;
    .img {
      width: 100%;
      position: relative;
      .bg-img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
      }
      .icon {
        width: 7.3rem;
        height: 1.5rem;
        position: absolute;
        z-index: 2;
        top: 0.8rem;
        left: 0.8rem;
      }
      &:before {
        content: '';
        display: inline-block;
        padding-bottom: 90%;
        width: 0;
        vertical-align: middle;
      }
    }
    .about {
      width: 4rem;
      height: 1.5rem;
      line-height: 1.35rem;
      position: absolute;
      color: #fff;
      border: 1px solid #fff;
      text-align: center;
      border-radius: 1rem;
      top: 1rem;
      right: 0.5rem;
      z-index: 1;
    }
  }
  .rules-box {
    width: 17rem;
    height: 22rem;
    line-height: 1.2rem;
    position: fixed;
    overflow: hidden;
    top: 50%;
    left: 50%;
    margin-left: -8.5rem;
    margin-top: -11rem;
    z-index: 999;
    background-image: linear-gradient(#a40020, #6b004a);
    border-radius: 0.3rem;
    color: #fff;
    img {
      width: 1.5rem;
      height: 1.5rem;
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      z-index: 1000;
    }
    .rule-text {
      p {
        width: 100%;
        text-align: center;
        font-size: 1.2rem;
        line-height: 2rem;
      }
      div {
        height: 16rem;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        p {
          font-size: 0.9rem;
          text-align: left;
          line-height: 1rem;
          padding: 0.5rem 0;
        }
      }
      width: 16rem;
      position: absolute;
      left: 0.5rem;
      top: 1rem;
      padding: 0.5rem;
    }
  }
  .shadow-box {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: -2.1rem;
    opacity: 0.5;
    background-color: #000;
    z-index: 998;
  }
}
</style>
