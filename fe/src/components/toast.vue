<template>
    <div v-show="tip" ref="toast" class="toast" :style="{'margin-left':offsetLeft,'margin-top':offsetTop}">{{tip}}</div>
</template>
<script>
export default {
    data() {
        return {
            tip: '',
            timer: null,
            offsetLeft: 0,
            offsetTop: 0
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
                const dw = dialog.offsetWidth
                _this.offsetLeft = -dw / 2 + 'px'
                _this.offsetTop = -dh / 2 + 'px'
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
    left: 50%;
    top: 50%;
    background: rgba(0, 0, 0, 0.65);
    padding: 0.6rem 1.5rem;
    border-radius: 3px;
    /* min-width: 12rem; */
    width: 14rem;
    max-width: 17rem;
    color: #fff;
    z-index: 9999;
}
</style>
