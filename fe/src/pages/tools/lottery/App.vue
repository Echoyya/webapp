<template>
  <div>
    <lottery ref="lottery" :id="4" :defaultPrize="3" :withMsgList="true" @drawClick="startDraw" @end="endLottery"></lottery>
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
      this.refs.lottery.tween()
    },
    endLottery(prize) {
      console.log(prize)
    }
  }
}
</script>
