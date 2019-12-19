<template>
  <div class="content">
    <div>请输入要唤醒app后打开的H5链接</div>
    <textarea v-model="url" />
    <div class="button" @click="callup">唤醒app</div>
  </div>
</template>
<script>
import { callApp } from '@/functions/app'
export default {
  data() {
    return {
      url: ''
    }
  },
  methods: {
    callup() {
      callApp.call(this, 'com.star.mobile.video.activity.BrowserActivity?loadUrl=' + encodeURIComponent(this.url))
    }
  }
}
</script>
<style>
.content {
  padding: 1rem 0;
}
textarea {
  width: 95%;
  height: 5rem;
  line-height: 1.5rem;
  margin: 1rem auto;
  display: block;
}
.button {
  width: 5rem;
  margin: 0 auto;
  text-align: center;
  background: #00a1ff;
  color: white;
  height: 2rem;
  line-height: 2rem;
}
</style>
