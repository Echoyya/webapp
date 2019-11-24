<template>
  <div>
    <div @click="callup">点我</div>
  </div>
</template>
<script>
import { invokeByHref, invokeByIframe, createScheme, callApp } from '@/functions/app'
export default {
  methods: {
    callup() {
      callApp.call(this, createScheme('com.star.mobile.video.activity.BrowserActivity?loadUrl=' + window.location.href))
      console.log(invokeByIframe)
      console.log(invokeByHref)
    }
  }
}
</script>
