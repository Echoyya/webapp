<template>
  <div class="error">
    <img src="@/assets/img/alert.png" alt />
    You must upgrade to use this feature
    <br />
    <a href="javascript:void(0)" @click="update">click to update</a>.
  </div>
</template>
<script>
export default {
  methods: {
    update() {
      window.location.href = 'https://itunes.apple.com/us/app/startimes/id1168518958?l=zh&ls=1&mt=8'
    }
  }
}
</script>
<style lang="less" scoped>
.error {
  width: 100%;
  text-align: center;
  color: #666666;
  img {
    display: block;
    width: 65%;
    margin: 4rem auto 2rem;
  }
}
</style>
