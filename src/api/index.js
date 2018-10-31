import superagent from 'superagent'
import { fetchInStrict, } from 'src/api/comm'
import { getHost } from 'src/util/comm'
import { getToken } from '../util/services'
import { items } from 'configuration/navigationAside'

const debug = require('debug')('CLIENT:api')
const host = getHost()

export function fetchAsideItems () {
  return new Promise(resolve => {
    resolve({ items: items, })
  })
}

export function checkLoginStatus ({ params = {}}) {
  debug('Going to send req to check status...')
  const url = `${host}/api/status`
  return fetchInStrict(url, { cookie: params.cookie })
}

export function fetchProfile ({ params = {}}) {
  const url = `${host}/api/profile`
  return fetchInStrict(url, { cookie: params.cookie })
}

export function uploadImage (file, type) {
  let url
  debug('Abt to send uploading image req.')
  debug('file', file)
  return new Promise((resolve, reject) => {
    if (type === 'member') {
      url = `${host}/api/image-member/member`
    } else if (type === 'post') {
      url = `${host}/api/image-post/post`
    } else {
      reject()
    }
    superagent
      .post(url)
      .set('Authorization', `Bearer ${getToken()}`)
      .send(file)
      .end((err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
  })
}
