<template>
  <div class="banner">
    <div class="top">
      <div class="img">
        <img src="@/assets/img/vote/TeamFission/bg-banner.png" alt="bg-img" class="bg-img" />
      </div>
      <div class="about" @click="showRule">About</div>
    </div>
    <div v-show="show_rules" class="rules-box">
      <img src="@/assets/img/vote/BSSRegister/bg-rule.png" alt />
      <div class="rule-text">
        1. Kutoka tarehe 8th Oct hadi 30th Oct, una kura 5 kila siku baada ya kuingia. Kura zitakuwa zinajumlishwa na kuwa halali hadi mwisho wa shughuli.
        <br />2. Unaweza kumpigia kura mshiriki yeyote unayempenda!
        <br />3. Washirikishe link rafiki zako na waombe wapakue app ya StarTimes ON ili kupata kura zaidi! Utapata kura 5 zaidi kwa kila mtumiaji mpya. Unavyozidi kuleta watumiaji wapya, ndivyo unavyopata kura zaidi!
        <br />4. Kila wakati unapopiga kura, utapata nafasi moja ya kushinda, na utapata fursa ya kushinda Abreader subwoofer, yenye thamani ya Shilingi 85,000 na Aborder bluetooth speaker, yenye thamani ya Shilingi 35,000, pamoja na Max VIP ya Mwezi ya StarTimes ON na Kuponi.
        <br />5. Zawadi zitakuwa zinatolewa siku ya pili ya kazi katika Me-> Kuponi zangu.
        <br />6. Wagombea 10 bora wenye kura nyingi zaidi wataweza kuingia kwenye usaili wa mwisho na kupata nafasi ya kushiriki 2019BSS.
      </div>
      <img src="@/assets/img/vote/BSSRegister/ic-close.png" alt @click="closeShadow" />
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
  background-image: linear-gradient(#a90828, #930537);
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
    height: 26rem;
    line-height: 1.2rem;
    position: fixed;
    overflow: hidden;
    top: 50%;
    left: 50%;
    margin-left: -8.5rem;
    margin-top: -13rem;
    z-index: 999;
    img {
      &:first-child {
        width: 100%;
        display: block;
      }
      &:last-child {
        width: 10%;
        display: block;
        margin: 1.5rem auto 0;
      }
    }
    .rule-text {
      width: 15rem;
      height: 14.5rem;
      color: #1b9145;
      position: absolute;
      left: 1rem;
      top: 4rem;
      padding: 0.5rem;
      overflow-x: hidden;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .share-btn {
      width: 8rem;
      height: 1.8rem;
      text-align: center;
      line-height: 1.8rem;
      color: #fff;
      background-image: url('~@/assets/img/vote/BSSRegister/btn-success.png');
      background-size: 8rem 1.8rem;
      position: absolute;
      left: 4.5rem;
      top: 19.2rem;
      border-radius: 0.2rem;
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
