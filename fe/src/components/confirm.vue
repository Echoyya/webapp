<template>
  <div class="confirm-box">
    <div :style="{display:style}" class="shadow-box"></div>
    <div :style="{display:style,'margin-left':offsetLeft,'margin-top':offsetTop}" ref="confirms" class="dialog">
      <div class="dialog-body">
        <div class="pop-default">
          <p>
            <span v-html="msg" />
          </p>
        </div>
      </div>
      <div class="dialog-footer">
        <div class="btn" @click="sure">{{yes}}</div>
        <div class="btn" @click="close">{{no}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: '',
      yes: 'YES',
      no: 'NO',
      style: 'none',
      callback: '',
      cancel: '',
      offsetLeft: 0,
      offsetTop: 0
    }
  },
  methods: {
    close() {
      this.style = 'none'
      if (this.cancel) {
        this.cancel()
      }
    },
    sure() {
      this.style = 'none'
      if (this.callback) {
        this.callback()
      }
    },
    show(msg, callback, cancel, yes, no) {
      const _this = this
      if (yes) this.yes = yes
      if (no) this.no = no
      this.msg = msg
      this.style = 'block'
      this.$nextTick(() => {
        const dialog = _this.$refs.confirms
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
      if (cancel) {
        this.cancel = cancel
      } else {
        this.cancel = ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
.confirm-box {
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
    background: white;
    border-radius: 2px;
    overflow: hidden;
    zoom: 1;
    z-index: 1001;
    width: 16rem;
    // min-width: 15rem;
    // max-width: 17rem;
    padding: 1.2rem;
    .pop-default {
      line-height: 1.4rem;
      padding: 0.8rem 0;
      min-height: 4.5rem;
    }
    .dialog-footer .btn {
      float: right;
      width: 49%;
      color: #0087eb;
      font-weight: bold;
      text-align: center;
    }
  }
}
</style>
