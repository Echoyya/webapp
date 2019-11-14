<template>
  <div class="error">
    <img src="@/assets/img/web/error500.png" alt />
    Sorry, there is a network error.
    <br />Please
    <a href>try again</a>.
  </div>
</template>
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
