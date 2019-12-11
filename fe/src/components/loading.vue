<template>
  <div v-if="loading" class="lds-ring">
    <div/>
    <div/>
    <div/>
    <div/>
  </div>
</template>
<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    }
  }
}
</script>
<style scoped>
.lds-ring {
  display: block;
  width: 3rem;
  height: 3rem;
  left: 50%;
  top: 50%;
  position: fixed;
  z-index: 1001;
  margin-left: -1.5rem;
  margin-top: -1.5rem;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  border: 0.3rem solid #0087eb;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #0087eb transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  -webkit-animation-delay: -0.45s;
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  -webkit-animation-delay: -0.3s;
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  -webkit-animation-delay: -0.15s;
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

