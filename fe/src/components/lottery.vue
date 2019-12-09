<template>
  <div>
    <div class="lottery">
      <ul class="clearfix">
        <li v-for="(item,key) in items" :key="key" :class="indexs==key?'active':''">
          <div>
            <div class="prize">
              <img :src="item.picture_url" />
            </div>
          </div>
        </li>
        <div class="getLuck" @click="drawClick">{{$t('vote.team.draw_button')}}</div>
      </ul>
    </div>
    <div v-if="withMsgList" class="msg-box">
      <div class="msg">
        <img src="@/assets/img/vote/TeamFission/ic-msg.png" alt />
        <transition-group name="list" tag="ul" @before-leave="beforeLeave">
          <li
            v-for="item in msgList"
            :key="item.reward_id"
          >{{item.nick_name?item.nick_name:(item.user_name?item.user_name:item.user_id)}} has won {{item.reward_name||''}}!</li>
        </transition-group>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * event drawClick 点击draw
 * event end 抽奖效果结束
 * event getItemsError(err) 获取抽奖项目失败
 * method  tween(func)
 */
import TWEEN from '@tweenjs/tween.js'
export default {
  props: {
    id: {
      required: true,
      type: Number,
      default: 1
    },
    defaultPrize: {
      required: false,
      type: Number,
      default: 3
    },
    withMsgList: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      items: [],
      drawing: false,
      indexs: 0,
      msgList: [],
      msgIndex: 0
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
          this.$emit('getItemsError', 'code is not 0')
        }
      })
      .catch(err => {
        this.items = []
        this.$emit('getItemsError', err)
      })
  },
  methods: {
    beforeLeave() {
      this.msgList.push(this.dataList[this.msgIndex])
      this.msgIndex = this.msgIndex + 1
      setTimeout(() => {
        this.msgList.pop()
      }, 3000)
    },
    getMsgList() {
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

            this.beforeLeave()
          } else {
            this.items = []
            console.log('Get winnings error!')
          }
        })
        .catch(err => {
          this.items = []
          console.log('Get winnings error!! ' + err)
        })
    },
    drawClick() {
      this.$emit('drawClick')
    },
    tween(waitFunc) {
      if (this.drawing) return
      let ani = this.animate()
      const defaultIndex = 8 * 5 + this.defaultPrize
      ani.to({ num: defaultIndex }, 6000)
      ani.start()
      waitFunc &&
        waitFunc(function(price) {
          ani.to({ num: 8 * 6 + price }, 7000)
        })
    },
    animate() {
      let frame = null
      function animate(time) {
        frame = requestAnimationFrame(animate)
        TWEEN.update(time)
      }
      const coods = { num: 0 }
      const _this = this
      let ani = new TWEEN.Tween(coods)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function(obj) {
          _this.indexs = Math.floor(obj.num % 8)
        })
        .onComplete(function(obj) {
          cancelAnimationFrame(frame)
          const prize = Math.floor(obj.num % 8)
          _this.$emit('end', prize)
        })
      frame = requestAnimationFrame(animate)
      return ani
    }
  }
}
</script>
<style lang="less" scoped>
.lottery {
  margin: 0 auto;
  background-image: url('~@/assets/img/vote/TeamFission/bg-lottery.png');
  background-size: 100% 101%;
  color: #ad5500;
  padding: 1.4rem 1.5rem;
  ul {
    position: relative;
    &:before {
      content: '';
      display: inline-block;
      padding-bottom: 100%;
      width: 0;
      vertical-align: middle;
    }
    li {
      width: 30%;
      display: block;
      position: absolute;
      overflow: hidden;
      background-color: #fff;
      padding: 1.5%;
      border-radius: 0.5rem;
      background-color: #a80044;
      &:nth-child(1) {
        left: 0%;
        top: 0%;
      }
      &:nth-child(2) {
        left: 34%;
        top: 0%;
      }
      &:nth-child(3) {
        left: 68%;
        top: 0%;
      }
      &:nth-child(4) {
        left: 68%;
        top: 34%;
      }
      &:nth-child(5) {
        left: 68%;
        top: 68%;
      }
      &:nth-child(6) {
        left: 34%;
        top: 68%;
      }
      &:nth-child(7) {
        left: 0%;
        top: 68%;
      }
      &:nth-child(8) {
        left: 0%;
        top: 34%;
      }
      &.active {
        background-color: #ff0090;
      }
      > div {
        width: 100%;
        .prize {
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .getLuck {
      width: 30%;
      border-radius: 0.5rem;
      text-align: center;
      position: absolute;
      top: 34%;
      left: 34%;
      font-size: 1.2rem;
      font-weight: bold;
      color: #fdf2ff;
      background-color: #ff008a;
      padding: 1.5%;
      &:active {
        background-color: #8b0048;
        color: #e0aac9;
      }
      &:before {
        content: '';
        display: inline-block;
        padding-bottom: 100%;
        width: 0;
        vertical-align: middle;
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
    height: 2.2rem;
    line-height: 2.2rem;
    overflow: hidden;
    transition: all 0.5s;
    position: relative;
    margin-bottom: 0.3rem;
    background-color: #26010e;
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
      top: 0.3rem;
    }
    ul {
      width: 100%;
      li {
        width: 100%;
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

.list-enter {
  transform: translateY(60px);
}
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-leave-to {
  opacity: 1;
  transform: translateY(-60px);
}
</style>
