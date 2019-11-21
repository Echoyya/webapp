<template>
  <div class="alert-box">
    <div :style="{display:style}" class="shadow-box"></div>
    <div :style="{display:style,'margin-left':offsetLeft,'margin-top':offsetTop}" ref="alerts" class="dialog">
      <img v-if="closeback" class="close" @click="close" src="@/assets/img/vote/TeamFission/ic_close.png" />
      <div class="dialog-body">
        <div class="pop-default">
          <p>
            <span v-html="msg" />
          </p>
        </div>
      </div>
      <div class="team-btn">
        <div @click="sure">{{text}}</div>
      </div>
      <div class="link">
        <slot name="link"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: '',
      style: 'none',
      callback: '',
      closeback: '',
      offsetLeft: 0,
      offsetTop: 0,
      text: ''
    }
  },
  methods: {
    sure() {
      this.style = 'none'
      if (this.callback) this.callback()
    },
    close() {
      this.style = 'none'
      if (this.closeback) this.closeback()
    },
    show(msg, callback, text, closeback) {
      const _this = this
      this.msg = msg
      this.text = text || 'OK'
      this.style = 'block'
      this.$nextTick(() => {
        const dialog = _this.$refs.alerts
        const dh = dialog.offsetHeight
        const dw = dialog.offsetWidth
        _this.offsetLeft = -dw / 2 + 'px'
        _this.offsetTop = -dh / 2 + 'px'
      })
      if (callback) {
        this.callback = callback
      } else {
        this.callback = ''
      }
      if (closeback) {
        this.closeback = closeback
      } else {
        this.closeback = ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
.alert-box {
  .shadow-box {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: none;
  }
  .dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    background: linear-gradient(#a40020, #6b004a);
    border-radius: 4px;
    overflow: hidden;
    zoom: 1;
    z-index: 1001;
    width: 16rem;
    padding: 1.5rem;
    .pop-default {
      line-height: 1.5rem;
      padding: 1.3rem 0;
      min-height: 3.5rem;
      font-size: 1.2rem;
      color: white;
      text-align: center;
    }
    .dialog-footer .btn {
      float: right;
      color: #0087eb;
      font-weight: bold;
    }
    .close {
      width: 1.3rem;
      height: 1.3rem;
      position: absolute;
      right: 0.5rem;
      top: 0.5rem;
    }
  }
}
.team-btn {
  width: 100%;
  margin: 1rem auto;
  text-align: center;
  div {
    background: linear-gradient(180deg, rgba(253, 94, 0, 1) 0%, rgba(250, 0, 67, 1) 100%);
    border-radius: 25px;
    border: 0.25rem solid rgba(26, 1, 96, 0.75);
    color: #ffffff;
    height: 2.25rem;
    line-height: 2.25rem;
    margin-top: 0.5rem;
  }
}
.link {
  text-align: center;
  a {
    color: #fabe00;
  }
}
</style>
