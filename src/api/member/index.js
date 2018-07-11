// import superagent from 'superagent'
// import { constructUrlWithQuery, fetchInStrict, } from 'src/api/comm'
// import { getHost, } from 'src/util/comm'
// const debug = require('debug')('CLIENT:api:comm')
// const host = getHost()

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
  // const url = `${host}/api/login`
  return new Promise((resolve, reject) => {
    // superagent
    //   .post(url)
    //   .set('Authorization', `Bearer ${token}`)
    //   .send(
    //     params
    //   ).end(function (err, res) {
    //     if (err) {
    //       reject(err)
    //     } else {
    //       saveToken(res.body.token)
    //       resolve({ status: res.status, profile: res.body.profile, })
    //     }
    //   })
    resolve({ status: 200, profile: {}, })
  })
}