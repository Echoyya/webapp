const team_activity_id = 1 // 接收activity_id 参数
export const searchTeam = function(team_no, callback) {
  if (team_no && !isNaN(team_no)) {
    this.$axios
      .get(`/voting/team-building/v1/team-info?team_activity_id=${team_activity_id}&team_no=${team_no}`)
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
      .post(`/voting/team-building/v1/joining?team_activity_id=${team_activity_id}&team_no=${team_no}`)
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
    .post(`/voting/team-building/v1/building?team_activity_id=${team_activity_id}`)
    .then(({ data }) => {
      callback && callback(data)
    })
    .catch(err => {
      console.log(err)
      callback && callback()
    })
}

export const searchMyTeam = function(callback) {
  this.$axios
    .get(`/voting/team-building/v1/participating-team?team_activity_id=${team_activity_id}`)
    .then(({ data }) => {
      callback && callback(data)
    })
    .catch(err => {
      console.log(err)
      callback && callback()
    })
}
