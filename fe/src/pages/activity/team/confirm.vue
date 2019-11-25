c<template>
  <div class="alert-box">
    <div :style="{display:style}" class="shadow-box"></div>
    <div
      :style="{display:style,'margin-left':offsetLeft,'margin-top':offsetTop}"
      ref="alerts"
      class="dialog"
    >
      <div class="dialog-body">
        <div class="pop-default">
          <div class="title">Welcome</div>
          <p>if you were invited by friends</p>
        </div>
      </div>
      <div class="team-btn" style="margin-top:0">
        <div @click="join">JOIN TEAM</div>
      </div>
      <div class="or">
        <a href="javascript:void(0)">or</a>
      </div>
      <div class="team-btn">
        <div @click="create">FORM A NEW TEAM</div>
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
      callback1: '',
      callback2: '',
      closeback: '',
      offsetLeft: 0,
      offsetTop: 0,
    }
  },
  methods: {
    join() {
      if (this.callback1) this.callback1()
    },
    create() {
      if (this.callback2) this.callback2()
    },
    show(callback1, callback2) {
      const _this = this
      this.style = 'block'
      this.$nextTick(() => {
        const dialog = _this.$refs.alerts
        const dh = dialog.offsetHeight
        const dw = dialog.offsetWidth
        _this.offsetLeft = -dw / 2 + 'px'
        _this.offsetTop = -dh / 2 + 'px'
      })
      if (callback1) {
        this.callback1 = callback1
      } else {
        this.callback1 = ''
      }
      if (callback2) {
        this.callback2 = callback2
      } else {
        this.callback2 = ''
      }
    },
    hide(){
      this.style = 'none'
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
      padding: 0.5rem 0 0;
      min-height: 3.5rem;
      font-size: 1.2rem;
      color: white;
      text-align: center;
      .title {
        margin: 0.5rem 0 1rem;
      }
      p {
        font-size: 1rem;
      }
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
  div {
    color: #fabe00;
  }
}
.or {
  text-align: center;
  a {
    color: #fabe00;
  }
}
</style>
