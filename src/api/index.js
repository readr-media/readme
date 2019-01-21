import superagent from 'superagent'
import { fetchInStrict, } from 'src/api/comm'
import { getHost } from 'src/util/comm'
import { getToken } from '../util/services'
import { items, nav } from 'configuration/'

const debug = require('debug')('CLIENT:api')
const host = getHost()

export function fetchAsideItems () {
  return new Promise(resolve => {
    resolve({ items: items, })
  })
}

export function fetchAsideNav () {
  return new Promise(resolve => {
    resolve({ items: nav, })
  })
}

export function fetchAvalibleModels ({ params = {} }) {
  const url = `${host}/api/available-ms`
  return fetchInStrict(url, { cookie: params.cookie })
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

