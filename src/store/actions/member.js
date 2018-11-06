
import * as memberFunc from 'src/api/member'

// const debug = require('debug')('CLIENT:store:actions:member')
const LOGIN = ({ commit, }, { params, token, }) => {
  return memberFunc.login(params, token).then(({ status, profile, }) => {
    commit('SET_LOGGEIN_STATUS', { body: true, })
    commit('SET_PROFILE', { profile, })
    return { status, }
  })
}

export {
  LOGIN,
}