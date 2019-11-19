<template>
  <div class="wrapper">
    <mBanner />
  </div>
</template>
<script>
import mBanner from '@/pages/activity/team/banner.vue'
import { formatAmount } from '@/functions/utils'
import { searchTeam } from '@/pages/activity/team/func'
import { getQueryVariable, callApp, callMarket, downApk } from '@/functions/app'
import ClipboardJS from 'clipboard'
export default {
  components: {
    mBanner,
  },
  data() {
    return {
      // 页面
      activityStart: new Date('2019-11-15 00:00:00').getTime(),
      activityEnd: new Date('2019-11-25 04:00:00').getTime(),

      mumberList: [],
      moreList1: [],
      moreList2: [],
      teamNum: '',
      teamNum1: '',
      teamNum2: '',
      number: '',
      leader_name: 'leader_name'
    }
  },
  computed: {
    platform() {
      if (this.appType == 1) {
        return 'Android'
      } else if (this.appType == 2) {
        return 'iOS'
      } else {
        return 'web'
      }
    }
  },
  created() {
    const during = Math.floor((this.activityEnd - this.activityStart) / 1000)
    const max = 10 * 10000
    const speed = Math.floor((max / during) * 100) / 100
    const period = Math.floor((this.$serverTime - this.activityStart) / 1000)
    this.number = formatAmount(10 + Math.floor(period * speed))

    this.teamNum = getQueryVariable(location.search.replace('?', ''), 'teamno')
    if (this.teamNum) {
      this.search()
    }
  },
  mounted() {
    this.$nextTick(() => {
      new ClipboardJS('#copy')
    })
  },
  methods: {
    callOrDownApp() {
      callApp.call(
        this,
        `com.star.mobile.video.activity.BrowserActivity?loadUrl=${window.location.origin}/activity/team/home.html?teamno=${this.teamNum}`,
        () => {
          callMarket.call(this, () => {
            this.$refs.confirm.show(
              this.$t('vote.team.download_tip'),
              () => {
                downApk.call(this)
              },
              () => {},
              'OK',
              'NOT NOW'
            )
          })
        }
      )
    },
    search() {
      searchTeam.call(this, this.teamNum, data => {
        if (data && (data.code == 1 || data.code == 0)) {
          this.mumberList = data.data.team_member_dtos
          this.leader_name = this.mumberList[0].nick_name
          if (data.code == 0) {
            this.teamNum1 = data.data.team_recommend_dtos[0].team_no
            this.teamNum2 = data.data.team_recommend_dtos[1].team_no
            this.moreList1 = data.data.team_recommend_dtos[0].team_member_dtos
            this.moreList2 = data.data.team_recommend_dtos[1].team_member_dtos
          }
        } else if (data.code == 2) {
          this.$refs.malert.show(this.$t('vote.team.search_nores'))
        } else {
          this.$refs.malert.show('Unknown error')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/vote/normal.less';
.wrapper {
  img,
  div,
  li {
    box-sizing: border-box;
  }
  width: 100%;
  font-size: 0.9rem;
  letter-spacing: -0.03rem;
  position: static;
  background-image: linear-gradient(#7c003d, #6c0049);
  padding-bottom: 1rem;
  .text {
    width: 95%;
    position: relative;
    height: 1.7rem;
    line-height: 1.7rem;
    font-size: 0.8rem;
    padding-left: 0.5rem;
    color: #fff;
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
    background-color: #ff3867;
    font-style: italic;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.text1 {
      margin: -18% auto 0;
    }
    &.text2 {
      margin: 0.5rem auto 0;
    }
    &.text3 {
      margin: 0.5rem auto 0;
    }
  }
  .invite {
    width: 95%;
    margin: 0 auto;
    position: relative;
    background-image: linear-gradient(#94027d, #540173);
    padding: 1rem 0.5rem;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
    .team {
      width: 85%;
      margin: 0 auto 0.5rem;
      text-align: center;
      .mumber {
        width: 33%;
        float: left;
        img {
          width: 65%;
          border: 2px solid #8600c8;
          border-radius: 100%;
          display: block;
          margin: 0 auto;
        }
        p {
          background: rgba(134, 0, 200, 1);
          border-radius: 8px;
          display: inline-block;
          padding: 0 0.5rem;
          position: relative;
          top: -0.7rem;
          color: #b360dd;
          font-size: 0.9rem;
          height: 1.1rem;
          line-height: 1.1rem;
        }
      }
    }
    > span {
      display: block;
      width: 95%;
      margin: 0 auto;
      padding-left: 0.5rem;
      color: #b360dd;
      font-size: 0.75rem;
      text-align: center;
    }
    .team-btn {
      width: 85%;
      margin: 0.5rem auto;
      text-align: center;
      span {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.8);
      }
      > div {
        background: linear-gradient(180deg, rgba(253, 94, 0, 1) 0%, rgba(250, 0, 67, 1) 100%);
        border-radius: 25px;
        border: 0.25rem solid rgba(26, 1, 96, 0.75);
        color: #ffffff;
        height: 2.75rem;
        line-height: 2.25rem;
        margin-top: 0.5rem;
      }
    }
    .copy {
      width: 85%;
      position: relative;
      margin: 0 auto;
      :nth-child(1),
      :nth-child(2),
      :nth-child(3) {
        color: #fff;
        display: inline-block;
        height: 2rem;
        line-height: 2rem;
      }
      :nth-child(1) {
        width: 25%;
        padding-left: 2%;
        padding-right: 3%;
        font-size: 0.75rem;
      }
      :nth-child(2) {
        width: 75%;
        background-color: #350052;
        padding-right: 22%;
        text-align: center;
        border-radius: 1rem;
        letter-spacing: 3px;
      }
      :nth-child(3) {
        position: absolute;
        right: 0;
        top: -1px;
        width: 25%;
        color: #ffbc00;
        background-color: #1c003e;
        border: 1px solid #ffbc00;
        border-radius: 1rem;
        text-align: center;
      }
    }
  }
  .more-team {
    width: 95%;
    margin: 0 auto;
    position: relative;
    background-image: linear-gradient(#94027d, #540173);
    padding: 1rem 0.5rem;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
    .team1,
    .team2 {
      color: #fff;
      .team-id {
        width: 90%;
        font-size: 0.75rem;
        height: 2rem;
        line-height: 2rem;
        margin: 0 auto;
      }
      .team-box {
        .team {
          width: 65%;
          text-align: center;
          display: inline-block;
          .mumber {
            width: 33%;
            float: left;
            img {
              width: 65%;
              border: 2px solid #8600c8;
              border-radius: 100%;
              display: block;
              margin: 0 auto;
            }
            p {
              background: rgba(134, 0, 200, 1);
              border-radius: 8px;
              display: inline-block;
              padding: 0 0.5rem;
              position: relative;
              top: -0.7rem;
              color: #b360dd;
              font-size: 0.9rem;
              height: 1.1rem;
              line-height: 1.1rem;
            }
          }
        }
        .join {
          width: 25%;
          height: 2rem;
          display: inline-block;
          font-size: 0.75rem;
          font-weight: bold;
          position: relative;
          right: -5%;
          top: -1rem;
          > div {
            width: 80%;
            height: 2rem;
            line-height: 1.7rem;
            border-radius: 1rem;
            border: 0.15rem solid #fa7a00;
            text-align: center;
          }
        }
      }
    }
  }
  .video {
    width: 95%;
    height: 8.5rem;
    margin: 0 auto;
    position: relative;
    background-image: linear-gradient(rgba(234, 4, 4, 0.3), rgba(57, 3, 157, 0.5));
    padding: 0 2.5%;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
    .item {
      position: relative;
      z-index: 2;
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
      overflow: hidden;
      .video-item {
        position: relative;
        display: inline-block;
        width: 33.3%;
        height: 4rem;
        line-height: 4rem;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.5);
        p {
          color: #fff;
        }
        img:nth-child(2) {
          position: absolute;
          width: 0.05rem;
          height: 1.2rem;
          top: 1.4rem;
          right: 0;
        }
        img:nth-child(3) {
          width: 1.2rem;
          height: 0.05rem;
          position: absolute;
          left: 42%;
          bottom: 0;
        }
        &:nth-child(3) {
          img:nth-child(2) {
            width: 1.2rem;
            height: 0.05rem;
            position: absolute;
            left: 42%;
            top: 3.95rem;
            bottom: 0;
          }
        }
      }
    }
    .img {
      width: 94%;
      height: 8rem;
      position: absolute;
      left: 3%;
      top: 0;
      background-image: url('~@/assets/img/vote/TeamFission/bg-banner.png');
      background-size: cover;
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
    }
  }
}
</style>
