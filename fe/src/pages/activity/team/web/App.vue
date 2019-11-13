<template>
  <div class="wrapper">
    <mBanner />
    <div class="invite box">
      <div class="title">Invite two friends to draw a lottery:</div>
      <div class="contant">
        <div>
          <div>
            <img :src="team.team_member_dtos[0].logo" alt />
          </div>
          <span>{{team.team_member_dtos[0].nick_name}}</span>
        </div>
        <img src="@/assets/img/vote/TeamFission/ic_forward2.png" alt />
        <div>
          <div>
            <img v-if="team.team_recommend_dtos[0].team_member_dtos[0]" :src="team.team_recommend_dtos[0].team_member_dtos[0].logo" alt />
          </div>
        </div>
        <div>
          <div>
            <img v-if="team.team_recommend_dtos[0].team_member_dtos[1]" :src="team.team_recommend_dtos[0].team_member_dtos[1].logo" alt />
          </div>
        </div>
      </div>
    </div>
    <alert-dialog ref="alert" />
    <confirm-dialog ref="confirm" />
    <toast-dialog ref="toast" />
  </div>
</template>
<script>
import alertDialog from '@/components/alert'
import confirmDialog from '@/components/confirm'
import toastDialog from '@/components/toast'
import mBanner from '@/pages/activity/team/banner.vue'
export default {
  components: {
    mBanner,
    alertDialog,
    confirmDialog,
    toastDialog
  },
  data() {
    return {
      // 页面
      appType: this.$appType,
      isLogin: this.$isLogin,
      user_id: this.$user.id,
      imgUrl: 'http://cdn.startimestv.com/banner/BSSVote2-banner.png',
      shareTitle: 'Bongo Star Search 2019',
      shareText: 'Saidia mshiriki wako unayempenda kurudi kwenye show!',

      activityStart: new Date('2019-11-05 00:00:00').getTime(),
      activityEnd: new Date('2019-11-18 04:00:00').getTime(),

      //team
      team: {
        allow_lottery: true,
        team_member_dtos: [
          {
            nick_name: 'leader',
            logo: 'http://cdn.startimestv.com/banner/bss-more.png'
          }
        ],
        joined: true,
        team_recommend_dtos: [
          {
            team_no: 'string',
            team_member_dtos: [
              {
                nick_name: 'name1',
                logo: 'http://cdn.startimestv.com/banner/bss-more.png'
              }
            ]
          }
        ]
      },
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
  mounted() {
    // this.mSendEvLog("page_show", "", "");
  },
  methods: {
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
  .box {
    position: relative;
    z-index: 2;
    width: 95%;
    margin: 0 auto;
    font-style: italic;
    .title {
      background-image: linear-gradient(rgba(189, 4, 78, 0.5), rgba(165, 3, 80, 0.5));
      width: 80%;
      height: 2rem;
      color: #ffbc00;
      border-top-right-radius: 1rem;
      border-top-left-radius: 1rem;
      padding-left: 0.8rem;
      line-height: 2rem;
    }
    .contant {
      padding: 0.5rem;
      background-image: linear-gradient(rgba(165, 3, 80, 0.5), #600165);
      border-radius: 1rem;
      border-top-left-radius: 0;
      color: #fff;
    }
  }
  .invite {
    margin-bottom: 0.5rem;
    .contant {
      padding: 0.5rem 0.5rem 1.5rem;
      position: relative;
      > div {
        display: inline-block;
        width: 20%;
        > div {
          width: 100%;
          position: relative;
          border: 2px solid #8700b1;
          border-radius: 50%;
          overflow: hidden;
          background-image: url("~@/assets/img/vote/TeamFission/bg-add.png");
          background-size: 100% 100%;
          img {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
          }
          &:before {
            content: '';
            display: inline-block;
            padding-bottom: 100%;
            width: 0;
            vertical-align: middle;
          }
        }
        span {
          color: #9f00ee;
          font-style: normal;
          position: absolute;
          left: 6%;
        }
      }
      :nth-child(1) {
        margin-right: 5%;
      }
      :nth-child(2) {
        margin-right: 6%;
      }
      :nth-child(3) {
        margin-right: 10%;
      }
      > img {
        width: 18%;
        position: relative;
        top: -1.4rem;
      }
    }
  }
}
</style>
