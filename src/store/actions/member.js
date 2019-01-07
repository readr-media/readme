
import * as memberFunc from 'src/api/member'

// const debug = require('debug')('CLIENT:store:actions:member')
const LOGIN = ({ commit, }, { params, token, }) => {
  return memberFunc.login(params, token).then(({ status, profile, }) => {
    commit('SET_LOGGEIN_STATUS', { body: true, })
    commit('SET_PROFILE', { profile, })
    return { status, }
  })
}

const LOGOUT = ({ commit, }) => {
  return new Promise((resolve) => {
    commit('SET_LOGGEIN_STATUS', { body: false, })
    commit('SET_PROFILE', { profile: {},})
    resolve()
  })
}

const DISPOSABLE_TOKEN = ({ commit, }, { type, }) => {
  return memberFunc.getDisposableToken(type).then((token) => {
    commit('SET_TOKEN', { token, type, })
  })
}

export {
  LOGIN,
  LOGOUT,
  DISPOSABLE_TOKEN
}