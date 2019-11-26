import { getQuery } from '@/functions/app'
const activity_id = getQuery('activity') || 1 // 接收activity_id 参数
export const searchTeam = function(team_no, callback) {
  if (team_no && !isNaN(team_no)) {
    this.$axios
      .get(`/voting/team-building/v1/team-info?team_activity_id=${activity_id}&team_no=${team_no}`)
      .then(({ data }) => {
        callback && callback(data)
      })
      .catch(err => {
        console.log(err)
        callback && callback()
      })
  } else {
    window.alert('team_no is undefined')
  }
}

export const joinTeam = function(team_no, callback) {
  if (team_no && !isNaN(team_no)) {
    this.$axios
      .post(`/voting/team-building/v1/joining?team_activity_id=${activity_id}&team_no=${team_no}`)
      .then(({ data }) => {
        callback && callback(data)
      })
      .catch(err => {
        console.log(err)
        callback && callback()
      })
  } else {
    window.alert('team_no is undefined')
  }
}

export const createTeam = function(callback) {
  this.$axios
    .post(`/voting/team-building/v1/building?team_activity_id=${activity_id}`)
    .then(({ data }) => {
      callback && callback(data)
    })
    .catch(err => {
      console.log(err)
      callback && callback()
    })
}

export const searchMyTeam = function(callback) {
  const time = new Date().getTime()
  this.$axios
    .get(`/voting/team-building/v1/participating-team?team_activity_id=${activity_id}&time=${time}`)
    .then(({ data }) => {
      callback && callback(data)
    })
    .catch(err => {
      console.log(err)
      callback && callback()
    })
}
