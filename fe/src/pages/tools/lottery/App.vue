<template>
  <div class="bg">
    <lottery ref="lottery" :id="8" :defaultPrizeIndex="3" :btnGray="false" :withMsgList="true" @drawClick="startDraw" @end="endLottery"></lottery>
  </div>
</template>
<script>
import lottery from '@/components/lottery'
export default {
  components: {
    lottery
  },
  methods: {
    startDraw() {
      this.$refs.lottery.tween()
    },
    endLottery(prize) {
      console.log(prize)
    }
  }
}
</script>
<style lang="less">
.bg {
  background: #21b7ff;
}
</style>
