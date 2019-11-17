<template>
  <div :style="{display:style}" class="share-box">
    <div class="shadow-box" @click="close"></div>
    <div class="slide-bar-share">
      <p>Share to:</p>
      <ul>
        <li @click="shareWithFacebook">
          <img src="@/assets/img/web/ic_facebook_def.png" />
          <p>Facebook</p>
        </li>
        <li @click="copyLink">
          <img src="@/assets/img/web/ic_copylink_def copy.png" />
          <p>Copy Link</p>
        </li>
        <li @click="shareWithTwitter">
          <img src="@/assets/img/web/ic_twitter_def.png" />
          <p>Twitter</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { shareByFacebookInWeb, shareByTwitterInWeb, copyClipboard } from '@/functions/app'
export default {
  data() {
    return {
      shareUrl: location.href,
      style: 'none'
    }
  },
  mounted() {
    window.fbAsyncInit = function() {
      // eslint-disable-next-line no-undef
      FB.init({
        appId: '159785064477978',
        status: true,
        xfbml: true,
        version: 'v3.2'
      })
    }
    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    const firstScript = document.getElementsByTagName('script')[0]
    firstScript.parentNode.insertBefore(script, firstScript)
  },
  methods: {
    close() {
      this.style = 'none'
    },
    show() {
      this.style = 'block'
    },
    shareWithFacebook() {
      this.$sendEvLog({
        category: 'share',
        action: 'share_click',
        label: 'facebook',
        value: this.shareUrl || window.location.href
      })
      shareByFacebookInWeb.call(this, this.shareUrl || window.location.href)
    },
    copyLink() {
      this.$sendEvLog({
        category: 'share',
        action: 'share_click',
        label: 'copylink',
        value: this.shareUrl || window.location.href
      })
      copyClipboard.call(this, this.shareUrl || window.location.href)
      this.close()
    },
    shareWithTwitter() {
      this.$sendEvLog({
        category: 'share',
        action: 'share_click',
        label: 'twitter',
        value: this.shareUrl || window.location.href
      })
      shareByTwitterInWeb.call(this, document.title, this.shareUrl || window.location.href)
    }
  }
}
</script>
<style lang="less" scoped>
p,
div,
li {
  box-sizing: border-box;
}
.share-box {
  .shadow-box {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  .slide-bar-share {
    width: 100%;
    height: 10rem;
    z-index: 1001;
    position: fixed;
    left: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.5);
    & > p {
      color: #333333;
      padding: 1rem;
    }
    ul {
      line-height: 2.5rem;
      font-size: 0.9rem;
      color: #666666;
      text-align: center;
      li {
        float: left;
        width: 33.3%;
        padding: 0 1rem;
        img {
          width: 65%;
        }
        >p{
          padding:0;
          height:1.2rem;
          line-height:1.2rem;
        }
      }
    }
  }
}
</style>
