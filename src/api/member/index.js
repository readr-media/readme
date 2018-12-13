import superagent from 'superagent'
import { handlerError, } from 'src/api/comm'
import { getHost, } from 'src/util/comm'
const debug = require('debug')('CLIENT:api:comm')
const host = getHost()

// export function getMembers ({ params, }) {
//   const url = constructUrlWithQuery(`${host}/api/members`, params)
//   return fetchInStrict(url, {})
// }

// export function getMembersByName ({ params, }) {
//   const url = constructUrlWithQuery(`${host}/api/members/nickname`, params)
//   return fetchInStrict(url, {})
// }

// export function fetchPersonalSetting () {
//   const url = `${host}/api/member/setting`
//   return fetchInStrict(url, {})
// }

export function login (params, token) {
  const url = `${host}/api/login`
  debug('token', token)
  return new Promise((resolve, reject) => {
    superagent
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(
        params
      ).end(function (err, res) {
        if (err) {
          const errWrapped = handlerError(err, res)  
          reject({ status: errWrapped.status, message: errWrapped.text })
        } else {
          resolve({ status: res.status, profile: res.body.profile, })
        }
      })
    // resolve({ status: 200, profile: {}, })
  })
}

export function getDisposableToken (type) {
  const url = `${host}/api/token/${type}`
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res.body.token)
        }
      })
  })
}