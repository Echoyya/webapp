<template>
  <div>
    <div class="lottery">
      <ul class="clearfix">
        <li v-for="(item,key) in items" :key="key" :class="indexs==key?'active':''">
          <div>
            <div class="prize">
              <img :src="item.picture_url" />
            </div>
            <div class="border"></div>
          </div>
        </li>
        <div class="getLuck" :class="{'getLuck-gray':btnGray}" @click="drawClick">{{btnText}}</div>
      </ul>
    </div>
    <div v-if="withMsgList" class="msg-box">
      <div class="msg">
        <img src="@/assets/img/vote/TeamFission/ic-msg.png" alt />
        <ul>
          <transition name="fade" @before-leave="beforeLeave">
            <li :key="msgIndex">{{msgNow}}</li>
          </transition>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * event drawClick 点击draw事件
 * event end 抽奖效果结束 会带着抽到奖的项目的信息
 * event getItemsError(err) 获取抽奖项目失败
 * event getMsgListError(err) 获取抽奖通告列表失败
 * event getResultError(err) 获取抽奖结果失败
 * method  tween()  开始抽奖
 */
import TWEEN from '@tweenjs/tween.js'
import qs from 'qs'
export default {
  props: {
    id: {
      required: true,
      type: Number,
      default: 1
    },
    voteId: {
      required: true,
      type: Number,
      default: 1
    },
    defaultPrizeIndex: {
      required: true,
      type: Number,
      default: 3
    },
    withMsgList: {
      required: false,
      type: Boolean,
      default: true
    },
    btnGray: {
      required: false,
      type: Boolean,
      default: true
    },
    btnText: {
      required: false,
      type: String,
      default: 'DRAW'
    },
    hasGotText: {
      required: false,
      type: String,
      default: 'has got'
    }
  },
  data() {
    return {
      items: [],
      drawing: false,
      indexs: -1,
      msg: {},
      dataList: [],
      msgIndex: 0
    }
  },
  computed: {
    msgNow() {
      if (this.msg.reward_id) {
        let reward_name = ''
        this.items.forEach(item => {
          if (item.id == this.msg.reward_id) {
            reward_name = item.name
          }
        })
        return (
          (this.msg.nick_name ? this.msg.nick_name : this.msg.user_name ? this.msg.user_name : this.msg.user_id) +
          ' ' +
          this.hasGotText +
          ' ' +
          reward_name
        )
      } else {
        return ''
      }
    }
  },
  created() {
    this.$axios
      .get(`/voting/lottery/v1/rewards?lottery_id=${this.id}`)
      .then(({ data }) => {
        if (data.code === 0) {
          this.items = data.data
          if (this.withMsgList) {
            this.getMsgList()
          }
        } else {
          this.items = []
          this.$emit('getItemsError', {
            code: 1,
            errMsg: 'server response is error'
          })
        }
      })
      .catch(() => {
        this.items = []
        this.$emit('getItemsError', {
          code: 2,
          errMsg: 'network error'
        })
      })
  },
  methods: {
    beforeLeave() {
      setTimeout(() => {
        this.msgIndex = this.msgIndex + 1
        if (this.msgIndex == this.dataList.length - 3) {
          this.getMsgList(1)
        }
        if (this.msgIndex == this.dataList.length) {
          this.msgIndex = 0
        }
        this.msg = Object.assign({}, this.dataList[this.msgIndex])
      }, 2500)
    },
    getMsgList(more) {
      this.$axios
        .get(`/voting/lottery/v1/winnings?lottery_id=${this.id}`)
        .then(res => {
          if (res.data.code === 0) {
            this.dataList = res.data.data
            const tmp = {}
            this.items.forEach(item => {
              tmp[item.id] = item.name
            })

            this.dataList.forEach(item => {
              if (item.user_name) {
                if (new RegExp(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/).test(item.user_name)) {
                  const arr = item.user_name.split('@')
                  if (arr[0].length > 3) {
                    item.user_name =
                      arr[0].substr(0, 2) + arr[0].slice(2, -1).replace(/[^\s]/g, '*') + arr[0].substring(arr[0].length - 1) + '@' + arr[1]
                  }
                  if (arr[0].length == 3) {
                    item.user_name = arr[0].replace(/(\w{1})\w{1}(\w{1})/, '$1*$2') + '@' + arr[1]
                  }
                  if (arr[0].length == 2) {
                    item.user_name = arr[0].replace(/\w{1}(\w{1})/, '*$1') + '@' + arr[1]
                  }
                  if (arr[0].length == 1) {
                    item.user_name = arr[0].replace(/\w{1}/, '*') + '@' + arr[1]
                  }
                } else if (new RegExp(/^\d{1,}$/).test(item.user_name)) {
                  item.user_name = item.user_name.toString().replace(/(.*)\d{3}(\d{3})/, '$1***$2')
                }
              }
              if (item.user_id) item.user_id = item.user_id.toString().replace(/(.*)\d{2}/, '$1**')
              item.reward_name = tmp[item.reward_id].name
            })
            if (!more) {
              this.msgIndex = 0
              this.msg = Object.assign({}, this.dataList[0])
              this.beforeLeave()
            }
          } else {
            this.$emit('getMsgListError', {
              code: 3,
              errMsg: 'Get winnings error!'
            })
          }
        })
        .catch(() => {
          this.$emit('getMsgListError', {
            code: 3,
            errMsg: 'Get winnings error!'
          })
        })
    },
    drawClick() {
      this.$emit('drawClick')
    },
    tween() {
      if (this.drawing) return
      this.drawing = true
      let ani = this.animate()
      const defaultIndex = 8 * 6 + this.defaultPrizeIndex
      ani.to({ num: defaultIndex }, 6000)
      ani.start()
      this.$axios({
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
          lottery_id: this.id,
          vote_id: this.voteId
        }),
        timeout: 6000,
        url: '/voting/v1/lottery/drawing'
      })
        .then(res => {
          if (res.data.code == 0) {
            const prizeNum = res.data.data
            let prizeIndex = this.defaultIndex
            this.items.forEach((item, index) => {
              if (item.id == prizeNum) {
                prizeIndex = index
              }
            })
            ani.to({ num: 8 * 6 + prizeIndex }, 7000)
          } else {
            this.drawing = false
            ani.stop()
            this.$emit('getResultError', {
              code: 4,
              errMsg: res.data.message
            })
          }
        })
        .catch(() => {
          this.drawing = false
          ani.stop()
          this.$emit('getResultError', {
            code: 4,
            errMsg: 'Network error'
          })
        })
    },
    animate() {
      let frame = null
      function animate(time) {
        frame = requestAnimationFrame(animate)
        TWEEN.update(time)
      }
      const coods = { num: this.indexs }
      const _this = this
      let ani = new TWEEN.Tween(coods)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function(obj) {
          _this.indexs = Math.floor(obj.num % 8)
        })
        .onStop(function() {
          _this.indexs = 0
        })
        .onComplete(function(obj) {
          _this.drawing = false
          cancelAnimationFrame(frame)
          const prizeIndex = Math.floor(obj.num % 8)
          _this.$emit('end', Object.assign({}, { prizeIndex: prizeIndex }, _this.items[prizeIndex]))
        })
      frame = requestAnimationFrame(animate)
      return ani
    }
  }
}
</script>
<style lang="less" scoped>
div,
li,
img {
  box-sizing: border-box;
}
.lottery {
  width: 100%;
  margin: 0 auto;
  background-image: url('~@/assets/img/vote/BSSVote3/bg-border.png');
  background-size: 100% 101%;
  color: #ad5500;
  padding: 3% 2.5% 1.5%;
  ul {
    width: 100%;
    margin: 0 auto;
    border-radius: 0.5rem;
    position: relative;
    &:before {
      content: '';
      display: inline-block;
      padding-bottom: 100%;
      width: 0;
      vertical-align: middle;
    }
    li {
      width: 28%;
      height: 28%;
      display: block;
      position: absolute;
      overflow: hidden;
      // border: 0.25rem solid transparent;
      // padding: 0.3rem;
      &:nth-child(1) {
        left: 6%;
        top: 6%;
      }
      &:nth-child(2) {
        left: 36%;
        top: 6%;
      }
      &:nth-child(3) {
        left: 66%;
        top: 6%;
      }
      &:nth-child(4) {
        left: 66%;
        top: 36%;
      }
      &:nth-child(5) {
        left: 66%;
        top: 66%;
      }
      &:nth-child(6) {
        left: 36%;
        top: 66%;
      }
      &:nth-child(7) {
        left: 6%;
        top: 66%;
      }
      &:nth-child(8) {
        left: 6%;
        top: 36%;
      }
      &.active .border{
        display: block;
        border-radius: 0.2rem;
        border: 0.25rem solid #8fd000;
        border-bottom-width: 0.6rem;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      > div {
        width: 100%;
        height: 100%;
        .prize {
          width: 100%;
          height: 100%;
          text-align: center;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .border {
          display: none;
        }
      }
    }
    .getLuck {
      width: 28%;
      text-align: center;
      position: absolute;
      top: 36%;
      left: 36%;
      font-size: 1.1rem;
      font-weight: bold;
      color: #fff;
      background-image: url('~@/assets/img/vote/ngDraw/bg-lobtn.png');
      background-size: 100% 100%;
      &:before {
        content: '';
        display: inline-block;
        padding-bottom: 100%;
        width: 0;
        vertical-align: middle;
      }
      &:active {
        background-image: url('~@/assets/img/vote/ngDraw/bg-lobtn-gray.png');
      }
      &.getLuck-gray {
        background-image: url('~@/assets/img/vote/ngDraw/bg-lobtn-gray.png');
      }
    }
  }
}
.msg-box {
  width: 100%;
  margin: 0 auto;
  padding: 0.5rem 0;
  .msg {
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    overflow: hidden;
    transition: all 0.5s;
    position: relative;
    margin-bottom: 0.3rem;
    background-color: #a87001;
    border-radius: 1.1rem;
    .anim {
      transition: all 0.5s;
    }
    img {
      position: absolute;
      display: block;
      width: 1.5rem;
      height: 1.5rem;
      left: 0.6rem;
      top: 0.25rem;
    }
    ul {
      width: 100%;
      position: relative;
      li {
        width: 100%;
        position: absolute;
        padding-left: 2.5rem;
        line-height: 2rem;
        height: 2rem;
        font-size: 0.75rem;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.fade-enter {
  transform: translateY(100%);
}
.fade-leave-to {
  transform: translateY(-100%);
}
.fade-enter-active,
.fade-leave-active {
  transition: 0.8s;
}
</style>
