<template>
  <div>
    <div @click="callup">点我</div>
  </div>
</template>
<script>
import { invokeByHref, invokeByIframe, createScheme,callApp } from '@/functions/app'
export default {
  methods: {
    callup() {
      callApp.call(
        this,
        createScheme('com.star.mobile.video.activity.BrowserActivity?loadUrl=' + window.location.origin + '/activity/team/home.html')
      )
      // invokeByIframe.call(this,createScheme('com.star.mobile.video.activity.BrowserActivity?loadUrl=' + window.location.origin + '/activity/team/home.html'))
      console.log(invokeByIframe)
      console.log(invokeByHref)
    }
  }
}
</script>
