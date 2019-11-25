<template>
  <div class="wrapper">
    <mBanner />
    <div class="search-body">
      <div class="search">
        <input v-model="teamNum" :class="{'full':!showBtn}" type="number" :placeholder="$t('vote.team.enterID')" />
        <div v-show="showBtn" class="btn" :class="{'can-submit':teamNum}" @click="submit">{{$t('vote.team.search')}}</div>
      </div>
      <div v-show="mumberList.length>0" class="team clearfix">
        <div v-for="(item,index) in mumberList" :key="index" class="mumber">
          <div>
            <img v-if="item.logo" :src="item.logo" />
            <img v-else src="https://cdn.startimestv.com/head/h_d.png" />
          </div>
          <p v-show="item.nick_name">{{item.nick_name}}</p>
        </div>
        <div v-for="(add) in 3-mumberList.length" :key="add+3" class="mumber">
          <span class="add">
            <img src="@/assets/img/vote/TeamFission/bg-add.png" />
          </span>
        </div>
      </div>
      <div v-show="mumberList.length>=3" class="team-btn">
        <span>{{$t('vote.team.form_late')}}</span>
        <div @click="create">{{$t('vote.team.form_newbtn')}}</div>
      </div>
      <div v-show="mumberList.length>=1&&mumberList.length<3" class="team-btn">
        <div @click="join">{{$t('vote.team.join_s')}}</div>
      </div>
    </div>
    <malert ref="malert" />
  </div>
</template>
<script>
import mBanner from '@/pages/activity/team/banner.vue'
import { searchTeam, joinTeam, createTeam } from '@/pages/activity/team/func'
import { toNativePage, getQuery } from '@/functions/app'
import malert from '@/pages/activity/team/malert'
export default {
  components: {
    mBanner,
    malert
  },
  data() {
    return {
      activity_id: getQuery('activiy') || 1,
      appType: this.$appType,
      teamNum: '',
      mumberList: [],
      showBtn: true
    }
  },
  methods: {
    mSendEvLog(action, label, value) {
      this.$sendEvLog({
        category: 'referral_team_' + this.$platform,
        action: action,
        label: label,
        value: value
      })
    },
    submit() {
      const teamno = ('' + this.teamNum).trim()
      if (teamno) {
        const reg = /^[0-9]+$/g
        if (!reg.test(teamno)) {
          this.$refs.malert.show(this.$t('vote.team.input_error'))
          return
        }
        searchTeam.call(this, teamno, data => {
          if (data && (data.code == 1 || data.code == 0)) {
            this.mumberList = data.data.team_member_dtos
            if (data.code == 0) {
              this.mSendEvLog('search_click', 'full', '1')
            } else {
              this.mSendEvLog('search_click', 'ok', '1')
            }
          } else if (data.code == 2) {
            this.$refs.malert.show(this.$t('vote.team.search_nores'))
            this.mSendEvLog('search_click', 'noresult', '1')
          } else {
            this.$refs.malert.show(this.$t('vote.team.network_error'))
          }
        })
      }
    },
    join() {
      this.mSendEvLog('joinbtn_click', 'search', '1')
      if (this.$isLogin) {
        joinTeam.call(this, this.teamNum, data => {
          if (data.code == 0) {
            window.location.href = `/activity/team/home.html?activity=${this.activity_id}`
          } else if (data.code == 1) {
            this.$refs.malert.show(this.$t('vote.team.joinpop_olduser'))
          } else if (data.code == 4) {
            this.$refs.malert.show(this.$t('vote.team.have_team'))
          } else {
            this.$refs.malert.show(data.message)
          }
        })
      } else {
        localStorage.setItem('join_teamno', this.teamNum)
        toNativePage('com.star.mobile.video.account.LoginActivity')
      }
    },
    create() {
      if (this.$isLogin) {
        createTeam.call(this, data => {
          if (data.code == 0) {
            window.location.href = `/activity/team/home.html?activity=${this.activity_id}`
          } else if (data.code == 1) {
            this.$refs.malert.show(this.$t('vote.team.have_team'))
          } else if (data.code == 2) {
            this.$refs.malert.show(this.$t('vote.team.share10_2'))
          } else {
            this.$refs.malert.show(data.message)
          }
        })
      } else {
        toNativePage('com.star.mobile.video.account.LoginActivity')
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/vote/normal.less';
.wrapper {
  .search-body {
    width: 93%;
    margin: 0 auto;
    background: linear-gradient(rgba(234, 4, 123, 0.3), rgba(57, 3, 157, 0.43));
    min-height: 20rem;
    border-radius: 5px;
    margin-top: -4rem;
  }
  .search {
    width: 92%;
    margin: 0 auto;
    position: relative;
    padding-top: 2rem;
    input {
      color: #ffffff;
      background: #1c003e;
      border: none;
      outline-style: none;
      letter-spacing: 5px;
      border-radius: 2rem;
      padding: 0 1rem;
      font-size: 1.1rem;
      box-sizing: border-box;
      width: 68%;
      height: 2.5rem;
      line-height: 2.25rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &.full {
        width: 100%;
        text-align: center;
      }
      &::-webkit-input-placeholder {
        letter-spacing: 0;
        font-size: 0.9rem;
      }
    }
    .btn {
      color: #ffffff;
      box-sizing: border-box;
      font-weight: bold;
      font-size: 0.8rem;
      text-align: center;
      background: rgba(153, 153, 153, 1);
      border-radius: 20px;
      display: inline-block;
      width: 30%;
      margin-left: 2%;
      height: 2.5rem;
      line-height: 2rem;
      border: 0.25rem solid rgba(26, 1, 96, 0.63);
      &.can-submit {
        background: linear-gradient(180deg, rgba(253, 94, 0, 1) 0%, rgba(250, 0, 67, 1) 100%);
      }
    }
  }
  .team {
    width: 85%;
    margin: 1rem auto;
    text-align: center;
    .mumber {
      width: 33%;
      float: left;
      > div {
        width: 65%;
        position: relative;
        margin: 0 auto;
        border: 2px solid #8600c8;
        border-radius: 100%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
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
        img {
          width: 65%;
          margin: 0 auto;
          border: 2px solid #8600c8;
          border-radius: 100%;
          display: block;
        }
      }
      p {
        font-size: 0.75rem;
        background: rgba(134, 0, 200, 1);
        border-radius: 8px;
        display: inline-block;
        padding: 0 0.2rem;
        position: relative;
        top: -0.7rem;
        color: #b360dd;
        font-size: 0.9rem;
        // height: 1.1rem;
        line-height: 1rem;
      }
    }
  }
  .team-btn {
    width: 75%;
    margin: 1rem auto;
    text-align: center;
    span {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
    }
    div {
      background: linear-gradient(180deg, rgba(253, 94, 0, 1) 0%, rgba(250, 0, 67, 1) 100%);
      border-radius: 25px;
      border: 0.25rem solid rgba(26, 1, 96, 0.75);
      color: #ffffff;
      height: 2.25rem;
      line-height: 2.25rem;
      margin-top: 0.5rem;
    }
  }
}
</style>
