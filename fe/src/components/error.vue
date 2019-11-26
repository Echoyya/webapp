<template>
  <div class="error">
    <img src="@/assets/img/web/error500.png" alt />
    Sorry, there is a network error.
    <br />
    <a href="javascript:void(0)" @click="login">Please login and try again</a>.
  </div>
</template>
<script>
import { toNativePage } from '@/functions/app'
export default {
  methods: {
    login() {
      toNativePage('com.star.mobile.video.account.LoginActivity')
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
