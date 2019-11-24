<template>
  <div v-show="tip" ref="toast" class="toast">{{tip}}</div>
</template>
<script>
export default {
  data() {
    return {
      tip: '',
      timer: null
    }
  },
  methods: {
    show(text, duration = 2000) {
      clearInterval(this.timer)
      const _this = this
      this.tip = text
      this.$nextTick(() => {
        const dialog = _this.$refs.toast
        const dh = dialog.offsetHeight
        dialog.style.marginTop = -dh / 2 + 'px'
        this.timer = setTimeout(() => {
          _this.tip = ''
        }, duration)
      })
    }
  }
}
</script>
<style scoped>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.65);
  padding: 0.6rem 1.5rem;
  border-radius: 3px;
  max-width: 17rem;
  color: #fff;
  z-index: 9999;
}
</style>
