<template>
  <div class="banner">
    <div class="top">
      <div class="img">
        <img src="@/assets/img/vote/TeamFission/bg-banner.png" alt="bg-img" class="bg-img" />
      </div>
      <div class="about" @click="showRule">About</div>
    </div>
    <div v-show="show_rules" class="rules-box">
      <img src="@/assets/img/vote/TeamFission/ic_close.png" alt @click="closeShadow" />
      <div class="rule-text">
        <p>Rules</p>
        1. The team leader can call 2 friends and form a team to enter the lucky draw.<br/>
        2. Prizes include 1 Day VIP, 7 Days VIP and 30  Days VIP.<br/>
        3. Only new devices and accounts are identified as new users can join the team.<br/>
        4. Each user have up to 10 chances to win. <br/>
        5. Activity valid until Dec 25, 2019<br/>
        6. StarTimes ON reserves the right of final decision and interpretation.<br/>
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
  methods: {
    showRule() {
      //   this.mSendEvLog("rule_click", "", "");
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

<style lang="less" scoped>
@import '~@/assets/less/vote/normal.less';
.banner {
  img,
  div,
  li {
    box-sizing: border-box;
  }
  width: 100%;
  background-image: linear-gradient(#a90828, #930537, #7C003D);
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
      line-height:1.3rem;
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
    background-image: linear-gradient(#A40020,#6B004A);
    border-radius: 0.3rem;
    color: #Fff;
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
        height: 3rem;
        text-align: center;
        margin: 0 auto;
        font-size: 1.2rem;
        line-height: 2rem;
      }
      width: 16rem;
      position: absolute;
      left: 0.5rem;
      top: 1rem;
      padding: 0.5rem;
      overflow: hidden;
      &::-webkit-scrollbar {
        display: none;
      }
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
