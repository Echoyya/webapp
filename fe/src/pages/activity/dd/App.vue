<template>
    <div id="app" class="wrapper">
        <div class="container">
            <img src="@/assets/img/vote/DreamTrip/bg_banner.png" alt="bg-img" class="bg-img" />
            <div class="tab">
                <img src="@/assets//img/vote/DreamTrip/btn_share.png" alt class="share-btn" />
                <ul v-show="pageList.length>0">
                    <li v-for="(item,i) in pageList" :key="i" class="lis" :class="i==index?'active':(i<currentPage?'pre':'')">
                        <p class="ep">{{item.group_name}}</p>
                        <p class="time">{{item.start_time.substr(0, 10)}}</p>
                    </li>
                </ul>
            </div>
            <div class="topic">
                <img v-show="topic.cover" class="title" :src="topic.cover" />
                <div class="pick-box" v-if="pageList[index]">
                    <div class="left">
                        <div>
                            <img :src="pageList[index].candidates[0].icon" />
                        </div>
                    </div>
                    <div class="middle">
                        <img src="@/assets/img/vote/DreamTrip/img-vs.png" />
                        <p>{{allNum}}</p>
                        <img src="@/assets/img/vote/DreamTrip/text1.png" />
                    </div>
                    <div class="right">
                        <div>
                            <img :src="pageList[index].candidates[1].icon" />
                        </div>
                    </div>
                    <div v-show="!picked||appType==0" class="pick">
                        <div class="btn">PICK</div>
                        <div class="btn">PICK</div>
                    </div>
                    <div v-show="picked&&appType>0" class="progress" :class="{'show-in':show_in}">
                        <div class="bar l"></div>
                        <div class="bar r"></div>
                        <div class="left">{{leftNum}}%</div>
                        <div class="right">{{rightNum}}%</div>
                        <span class="icon-y"></span>
                        <span class="icon-b"></span>
                        <span class="add-one l" :class="{'l-show':l_show}">+1</span>
                        <span class="add-one r" :class="{'r-show':r_show}">+1</span>
                    </div>
                </div>
                <img class="cloud2" src="@/assets/img/vote/DreamTrip/img_clound2.png" alt />
                <img class="cloud3" src="@/assets/img/vote/DreamTrip/img_clound3.png" alt />
            </div>
            <div id="comment" class="comment">
                <div class="comment-box">
                    <ul v-show="commentList.length>0" id="ulList">
                        <li v-for="(item,key) in commentList" :id="key" :key="key" class="barrage">
                            <img :src="item.avatar" alt />
                            <p>{{item.content}}</p>
                        </li>
                    </ul>
                </div>
                <div class="send-box">
                    <textarea v-model="commentText" type="text" placeholder="Share your feelings..." maxlength="100" />
                    <div class="btn">{{disabled?`${during}s`:`SEND`}}</div>
                </div>
            </div>
            <img src="@/assets/img/vote/DreamTrip/img_share.png" class="img-share" alt @click="toShare" />
            <div class="bg-bottom">
                <img class="bg-img" src="@/assets/img/vote/DreamTrip/bg_down.png" alt />
                <div class="bottom-item">
                    <div class="video" @click="toPlayer(video.link_vod_code,'topic')">
                        <div class="div">
                            <img :src="video.cover" alt />
                        </div>
                        <img src="@/assets/img/vote/DreamTrip/btn-play.png" alt class="play" />
                        <div class="title">{{video.description}}</div>
                    </div>
                    <div class="video" @click="toPlayer(film.link_vod_code,'fulleps')">
                        <div class="div">
                            <img :src="film.cover" alt />
                        </div>
                        <img src="@/assets/img/vote/DreamTrip/btn-play.png" alt class="play" />
                        <div class="title">{{film.description}}</div>
                    </div>
                    <div class="video" @click="toPlayer(highLight.link_vod_code,'highlight')">
                        <div class="div">
                            <img :src="highLight.cover" alt />
                        </div>
                        <img src="@/assets/img/vote/DreamTrip/btn-play.png" alt class="play" />
                        <div class="title">{{highLight.description}}</div>
                    </div>
                </div>
            </div>
        </div>
        <alert-dialog ref="alert" />
    </div>
</template>
<script>
import words from "./words";
import alertDialog from "@/components/alert";
import { playVodinApp, shareInvite } from "@/functions/app";
export default {
  name: "Dream-Destination",
  components: {
    alertDialog
  },
  data() {
    return {
      appType: this.$appType,
      isLogin: this.$isLogin,
      vote_id: 17,
      index: 0, // 当前所在的节目期数
      currentPage: 1,
      pageList: [],
      words: words,
      source: {},
      timer: null, // tab滚动定位定时器
      commentList: [],
      last_id: 0, // 上一次请求的最后一条弹幕id
      timeNum: 0, // 记录已在当前页面上成功调用获取弹幕接口的次数
      number: 20, // 每次请求的弹幕数量
      during: 5, // 发送弹幕后倒计时
      disabled: false, // send状态
      show_in: false,
      l_show: false,
      r_show: false,
      leftNum: 0,
      rightNum: 0,
      leftNumVal: 0,
      rightNumVal: 0,
      allNum: 0,
      picked: false, // 是否已经投票
      canVote: true, // 防多pick
      lineSpace: 40,
      pageWidth: 0, // 页面可视区域宽度
      count: 0, // 当前完全滚入屏幕的弹幕下标
      speed: 200, // 弹幕速度，越大越慢
      minSp: 0.6, // 弹幕的最小速度
      maxSp: 1, // 弹幕的最大速度
      minSpace: 80, // 两行弹幕的最小间隔
      maxSpace: 240, // 两行弹幕的最大间隔
      time: null, // 弹幕滚动定时器
      commentText: "", // 发送的内容
      loaded_page: false,
      canClickTab1: true,
      canClickTab2: true,
      tip: "",
      title: "Dream Destination",
      content: ""
    };
  },
  computed: {
    film() {
      return this.source["a" + (this.index + 1)] || {};
    },
    highLight() {
      return this.source["b" + (this.index + 1)] || {};
    },
    topic() {
      return this.source["c" + (this.index + 1)] || {};
    },
    video() {
      return this.source["d" + (this.index + 1)] || {};
    },
    shareObj() {
      return this.source["e" + (this.index + 1)] || {};
    },
    canClickTab() {
      return this.canClickTab1 && this.canClickTab2;
    },
    platform() {
      if (this.appType == 1) {
        return "Android";
      } else if (this.appType == 2) {
        return "iOS";
      } else {
        return "web";
      }
    }
  },
  mounted() {
    this.pageWidth = document.body.clientWidth;
    this.getPagelist();
    this.getSource();
  },
  methods: {
    mSendEvLog(action, label, value) {
      this.$sendEvLog({
        category: "vote_DreamDestination_" + this.platform,
        action: action,
        label: label,
        value: value
      });
    },
    getPagelist() {
      this.$axios
        .get(`/voting/v3/candidates-show?vote_id=${this.vote_id}`)
        .then(({ data }) => {
          if (data.code === 0) {
            this.pageList = data.data.sort(function(a, b) {
              return a.start_time - b.start_time;
            });
            let index = 1;
            for (let i = 0; i < this.pageList.length; i++) {
              const item = this.pageList[i];
              const start_time = new Date(
                item.start_time.replace(/-/g, "/").replace("T", " ") + "+0000"
              ).getTime();
              if (this.$serverTime < start_time) {
                index = i;
                this.currentPage = index;
                this.index = index - 1;
                this.getCommentList();
                break;
              }
            }
          } else {
            this.$alert("Get page list error! " + data.message);
          }
        })
        .catch(err => {
          this.$alert("Get page list error!! " + err);
        });
    },
    getSource() {
      this.$axios
        .get(`/voting/v1/program?vote_id=${this.vote_id}`)
        .then(({ data }) => {
          if (data.code === 0) {
            data.data.forEach(item => {
              this.source[item.name] = item;
            });
            // this.initPage()
          } else {
            this.$refs.alert.show("Get source list error! " + data.message);
          }
        })
        .catch(err => {
          this.$refs.alert.show("Get source list error!! " + err);
        });
    },
    getCommentList() {
      this.$axios
        .get(
          `/voting/v1/comments?comment_activity_id=${this.index + 1}&last_id=${
            this.last_id
          }&num_per_page=${this.number}`
        )
        .then(({ data }) => {
          if (data.code === 0) {
            this.timeNum++;
            this.last_id = data.data[data.data.length - 1].id;
            const tmpArr = [];
            if (this.timeNum == 1) {
              data.data.forEach((item, index) => {
                tmpArr[index] = item;
                tmpArr[index + this.number] = item;
              });
            } else if (this.timeNum % 2 == 0) {
              data.data.forEach((item, index) => {
                tmpArr[index + this.number] = item;
              });
            } else {
              data.data.forEach((item, index) => {
                tmpArr[index] = item;
              });
            }
            this.commentList = tmpArr;
            // TODO 判断是否可以点击tab
            this.canClickTab1 = true
            this.$nextTick(() => {
              for (let j = 0; j < this.number * 2; j++) {
                document.getElementById(j).style.right = -2000 + "px";
              }
              this.initComment();
            });
          } else {
            this.$alert("Get comment list error! " + data.message);
          }
        })
        .catch(err => {
          this.$alert("Get comment list error!! " + err);
        });
    },
    initComment() {
      for (let i = 0; i < this.commentList.length; i++) {
        const commentItem = document.getElementById(i);
        const img = commentItem.getElementsByTagName("img")[0];
        const p = commentItem.getElementsByTagName("p")[0];
        if (this.commentList[i].avatar) {
          img.src =
            this.commentList[i].avatar ==
            "http://cdn.startimestv.com/head/h_d.png"
              ? "http://cdn.startimestv.com/banner/DD_user_icon.png"
              : this.commentList[i].avatar;
        } else {
          img.src = "http://cdn.startimestv.com/banner/DD_user_icon.png";
        }
        p.innerText = decodeURI(this.commentList[i].content);
        const commentWidth = p.offsetWidth + 35;
        commentItem.style.width = commentWidth + 15 + "px";
      }
      let s = document.getElementById(this.count).offsetWidth / this.speed;
      if (s < this.minSp) s = this.minSp;
      else if (s > this.maxSp) s = this.maxSp;
      this.animate(
        document.getElementById(this.count),
        -document.getElementById(this.count).offsetWidth,
        s
      );
    },
    animate(dom, num, speed) {
      let flag = true;
      const time = setInterval(() => {
        if (parseInt(dom.style.right) >= 2000) {
          clearInterval(time);
          return true;
        }
        // if (num > this.space && flag) {
        if (
          (dom.offsetWidth + num > this.maxSpace || num > this.minSpace) &&
          flag
        ) {
          flag = false;
          // console.log(this.count + ' has finished ')
          this.count++;
          if (
            this.timeNum % 2 != 0
              ? this.count >= this.number
              : this.count >= this.number * 2
          ) {
            if (this.timeNum != 0 && this.timeNum % 2 == 0) {
              this.count = 0;
            }
            this.getCommentList();
            return true;
          }
          let s = document.getElementById(this.count).offsetWidth / this.speed;
          if (s < this.minSp) s = this.minSp;
          else if (s > this.maxSp) s = this.maxSp;
          this.animate(
            document.getElementById(this.count),
            -document.getElementById(this.count).offsetWidth,
            s
          );
        }
        if (num <= this.pageWidth + 20) {
          dom.style.right = num + "px";
          num += speed;
        } else {
          clearInterval(time);
        }
      }, 5);
    },
    toPlayer(code, label) {
      this.mSendEvLog("video_click", label, this.index + 1);
      if (this.appType == 0) {
        this.callOrDownApp();
        return;
      }
      if (code) {
        playVodinApp.call(this, this.appType, code);
      }
    },
    toShare() {
      this.mSendEvLog("share_click", "", "");
      if (this.appType >= 1) {
        shareInvite(
          `${window.location.href}?utm_source=REGISTER&utm_medium=BSS&utm_campaign=${this.platform}`,
          this.shareTitle,
          this.shareText,
          this.imgUrl
        );
      } else {
        this.$store.commit("SET_SHARE_STATE", true);
      }
    }
  }
};
</script>
<style lang="less" scoped>
@keyframes go_in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes add_one {
  0% {
    opacity: 1;
    transform: scale(0);
  }
  100% {
    opacity: 0.2;
    transform: scale(5);
  }
}
.wrapper {
  background-color: #3cb3ff;
  background-repeat: repeat-y;
  font-size: 0.9rem;
  position: static;
  .container {
    > img {
      display: block;
      margin: 0 auto;
      padding-top: 0.5rem;
      width: 95%;
      height: auto;
      &.bg-img {
        padding-top: 0;
        width: 100%;
      }
      &.img-share {
        width: 90%;
        padding: 0;
      }
    }
    .tab {
      position: relative;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -moz-user-select: none; /*火狐*/
      -webkit-user-select: none; /*webkit浏览器*/
      -ms-user-select: none; /*IE10*/
      -khtml-user-select: none; /*早期浏览器*/
      user-select: none;
      .share-btn {
        position: absolute;
        right: 0;
        top: -3.5rem;
        height: 2rem;
      }
      ul {
        width: 100%;
        height: 3rem;
        padding-top: 0.3rem;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        overflow-x: auto;
        font-size: 0;
        background-color: #006bb5;
        position: relative;
        li {
          width: 6rem;
          height: 3rem;
          display: inline-block;
          text-align: center;
          line-height: 1.2rem;
          font-size: 1rem;
          position: relative;
          .ep {
            color: #d9d9d9;
            font-weight: bold;
          }
          .time {
            color: #b1b1b1;
            font-size: 0.75rem;
          }
          &.active {
            .ep,
            .time {
              color: #fff;
            }
            &::after {
              content: "";
              display: block;
              width: 3rem;
              height: 0.2rem;
              background: #ffbe01;
              position: absolute;
              left: 1.5rem;
              bottom: 0;
            }
          }
          &.pre {
            .ep,
            .time {
              color: #fff;
            }
          }
        }
      }
    }
    .topic {
      width: 100%;
      position: relative;
      .title {
        width: 90%;
        margin: 1rem 5% 1rem;
      }
      .pick-box {
        font-size: 0;
        width: 100%;
        .left,
        .right {
          font-size: 0.9rem;
          width: 36%;
          position: relative;
          overflow: hidden;
          div {
            position: relative;
            width: 100%;
            background-color: #2b495e;
            border-radius: 0.25rem;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
            }
            &:before {
              content: "";
              display: inline-block;
              padding-bottom: 100%;
              width: 0.1px;
              vertical-align: middle;
            }
          }
        }
        .left {
          float: left;
        }
        .right {
          float: right;
        }
        .middle {
          vertical-align: top;
          display: inline-block;
          font-size: 0.75rem;
          width: 18%;
          height: 100%;
          position: relative;
          z-index: 3;
          img {
            width: 85%;
            margin-left: 8.5%;
            &:first-child {
              padding-top: 0.5rem;
              margin-left: 5.5%;
            }
          }
          p {
            width: 95%;
            text-align: center;
            margin-left: 2.5%;
            color: #efd153;
            padding-top: 0.5rem;
            white-space: nowrap;
            overflow: visible;
          }
        }
        .left {
          padding-left: 5%;
        }
        .right {
          padding-right: 5%;
        }
        .pick {
          width: 90%;
          margin-left: 5%;
          margin-top: 1.5rem;
          position: relative;
          overflow: hidden;
          display: inline-block;
          padding-bottom: 1rem;
          z-index: 3;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -moz-user-select: none; /*火狐*/
          -webkit-user-select: none; /*webkit浏览器*/
          -ms-user-select: none; /*IE10*/
          -khtml-user-select: none; /*早期浏览器*/
          user-select: none;
          div {
            display: inline-block;
            font-size: 0.9rem;
            width: 30%;
            height: 1.6rem;
            background-color: #ffcc38;
            border-radius: 1rem;
            text-align: center;
            line-height: 1.6rem;
            color: #fff;
            font-weight: bold;
            &:first-child {
              margin-left: 5%;
            }
            &:last-child {
              margin-left: 30%;
            }
          }
        }
        .progress {
          width: 90%;
          margin-left: 5%;
          margin-top: 1rem;
          position: relative;
          padding-bottom: 0.4rem;
          &.show-in {
            animation: go_in 0.5s;
          }
          .bar {
            display: inline-block;
            height: 0.8rem;
            background-size: 0.8rem 0.8rem;
            background-repeat: repeat;
            margin-bottom: 0.9rem;
            &.l {
              width: 45%;
              margin-left: 5%;
              border-radius: 0.4rem 0 0 0.4rem;
              background-image: repeating-linear-gradient(
                135deg,
                #e9cf4b 0%,
                #e9cf4b 25%,
                #fdf39a 25%,
                #fdf39a 50%
              );
            }
            &.r {
              width: 45%;
              border-radius: 0 0.4rem 0.4rem 0;
              background-image: repeating-linear-gradient(
                135deg,
                #5d9ca1 0%,
                #5d9ca1 25%,
                #77c3e2 25%,
                #77c3e2 50%
              );
            }
          }
          .left,
          .right {
            font-size: 0.75rem;
            display: inline-block;
            width: 30%;
            height: 1rem;
            color: #fff;
            font-weight: bold;
            position: relative;
            z-index: 3;
          }
          .left {
            text-align: left;
            color: #ffe2aa;
          }
          .right {
            margin-left: 40%;
            text-align: right;
            color: #0964a0;
          }
          span {
            display: block;
            width: 0.6rem;
            height: 0.35rem;
            position: absolute;
            top: 1.1rem;
            background-size: 0.6rem 0.35rem;
            &.icon-y {
              left: 7%;
              background-image: url("~@/assets/img/vote/DreamTrip/ic-yellow.png");
            }
            &.icon-b {
              right: 7%;
              background-image: url("~@/assets/img/vote/DreamTrip/ic-blue.png");
            }
            &.add-one {
              font-size: 0.75rem;
              width: 1rem;
              height: 1rem;
              position: absolute;
              top: -1.3rem;
              font-weight: bold;
              visibility: hidden;
              &.l {
                left: 10%;
                color: #ff6b31;
                opacity: 0;
                &.l-show {
                  animation: add_one 2s;
                }
              }
              &.r {
                right: 10%;
                color: #ff6b31;
                opacity: 0;
                &.r-show {
                  animation: add_one 2s;
                }
              }
            }
          }
        }
      }
      .cloud2,
      .cloud3 {
        position: absolute;
        z-index: 2;
        &.cloud3 {
          left: 0;
          bottom: 0.7rem;
          width: 4.5rem;
        }
        &.cloud2 {
          right: 0;
          bottom: -2rem;
          width: 3.2rem;
        }
      }
    }
    .comment {
      position: relative;
      overflow: hidden;
      margin-bottom: 2rem;
      .comment-box {
        width: 90%;
        height: 200px;
        margin: 0 auto;
        background-image: url("~@/assets/img/vote/DreamTrip/bg_barrage.png");
        background-size: 100% 200px;
        ul {
          position: relative;
          top: 13.5px;
          .barrage {
            background-color: #09659d;
            border-radius: 15px;
            height: 30px;
            line-height: 30px;
            position: absolute;
            right: -2000px;
            &:nth-child(4n) {
              top: 120px;
            }
            &:nth-child(4n-1) {
              top: 80px;
            }
            &:nth-child(4n-2) {
              top: 40px;
            }
            &:nth-child(4n-3) {
              top: 0px;
            }
            img {
              display: inline-block;
              width: 28px;
              height: 28px;
              background-color: #bfbfbf;
              border-radius: 14px;
              position: relative;
              top: -1px;
              left: 1.8px;
            }
            p {
              display: inline-block;
              white-space: nowrap;
              color: #fff;
              margin-left: 6px;
            }
          }
        }
      }
      .send-box {
        width: 90%;
        margin: 0.5rem 5%;
        height: 2.5rem;
        background-image: url("~@/assets/img/vote/DreamTrip/bg-send.png");
        background-size: 100% 2.5rem;
        border-radius: 1.25rem;
        position: relative;
        textarea {
          border: none;
          outline: none;
          display: block;
          width: 70%;
          height: 1.8rem;
          line-height: 1.8rem;
          -webkit-border-radius: 0.9rem;
          -moz-border-radius: 0.9rem;
          -ms-border-radius: 0.9rem;
          -o-border-radius: 0.9rem;
          border-radius: 0.9rem;
          padding: 0 0.5rem;
          margin: 0;
          color: #666;
          position: absolute;
          left: 2%;
          top: 0.35rem;
          white-space: nowrap;
          overflow: hidden;
          overflow-x: auto;
          resize: none;
        }
        .btn {
          display: block;
          width: 25%;
          margin-left: 72%;
          height: 2.5rem;
          line-height: 2.5rem;
          color: #fff;
          font-size: 1rem;
          font-weight: bold;
          text-align: center;
        }
      }
    }
    .bg-bottom {
      width: 100%;
      margin: 2.5rem auto 0;
      position: relative;
      .bg-img {
        width: 100%;
        position: absolute;
        bottom: -11rem;
        z-index: 0;
      }
      .bottom-item {
        position: relative;
        z-index: 1;
        width: 100%;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -moz-user-select: none; /*火狐*/
        -webkit-user-select: none; /*webkit浏览器*/
        -ms-user-select: none; /*IE10*/
        -khtml-user-select: none; /*早期浏览器*/
        user-select: none;
        .video {
          margin: 1rem auto 0;
          width: 80%;
          position: relative;
          .div {
            position: relative;
            width: 100%;
            background-color: #2b495e;
            border-radius: 0.3rem;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
            }
            &:before {
              content: "";
              display: inline-block;
              padding-bottom: 57%;
              width: 0;
              vertical-align: middle;
            }
          }
          > img.play {
            display: block;
            width: 2rem;
            height: 2rem;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -1.1rem;
            margin-top: -2.3rem;
          }
          .title {
            height: 2.4rem;
            line-height: 1.2rem;
            margin-top: 0.5rem;
            font-size: 1rem;
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  .vote-toast {
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -4rem;
    margin-top: -0.75rem;
    font-size: 1rem;
    background: rgba(0, 0, 0, 0.65);
    border-radius: 3px;
    width: 8rem;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    color: #fff;
    z-index: 9999;
  }
}
</style>
