<template>
    <div class="alert-box">
        <div :style="{display:style}" class="shadow-box"></div>
        <div
            :style="{display:style,'margin-left':offsetLeft,'margin-top':offsetTop}"
            ref="alerts"
            class="dialog"
        >
            <div class="dialog-body">
                <div class="pop-default">
                    <p>
                        <span v-html="msg" />
                    </p>
                </div>
            </div>
            <div class="dialog-footer">
                <div class="btn" @click="sure">{{text}}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      msg: "",
      style: "none",
      callback: "",
      offsetLeft: 0,
      offsetTop: 0,
      text: ""
    };
  },
  methods: {
    sure() {
      this.style = "none";
      if (this.callback) this.callback();
    },
    show(msg, callback, text) {
      const _this = this;
      this.msg = msg;
      this.text = text || "OK";
      this.style = "block";
      this.$nextTick(() => {
        const dialog = _this.$refs.alerts;
        const dh = dialog.offsetHeight;
        const dw = dialog.offsetWidth;
        _this.offsetLeft = -dw / 2 + "px";
        _this.offsetTop = -dh / 2 + "px";
      });
      if (callback) {
        this.callback = callback;
      } else {
        this.callback = "";
      }
    }
  }
};
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
      color: #0087eb;
      font-weight: bold;
    }
  }
}
</style>
