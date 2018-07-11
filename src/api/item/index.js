import { PROJECT_ACTIVE, } from 'api/config'
import { apiMap, } from 'src/api/item/map'
import { del, put, post, } from 'src/api/comm'
import { filter, get, } from 'lodash'
import { getHost, } from 'src/util/comm'
const debug = require('debug')('CLIENT:api:item')
const host = getHost()

export function updateItem ({ params, flag, }) {
  const targetApi = get(filter(apiMap, { item: flag, method: 'PUT', }), '0.target')
  const url = `${host}/api/${targetApi}`
  return targetApi ? put(url, params) : Promise.reject({ status: '400', message: '"targetApi" Not Found.', })
}

export function postItem ({ params, flag, }) {
  const targetApi = get(filter(apiMap, { item: flag, method: 'POST', }), '0.target')
  const url = `${host}/api/${targetApi}`
  params.active = PROJECT_ACTIVE.ACTIVE
  return targetApi ? post(url, params) : Promise.reject({ status: '400', message: '"targetApi" Not Found.', })
}

export function delItem ({ params, flag, }) {
  const targetApi = get(filter(apiMap, { item: flag, method: 'DELETE', }), '0.target')
  const url = `${host}/api/${targetApi}`
  return targetApi ? del(url, params) : Promise.reject({ status: '400', message: '"targetApi" Not Found.', })
}
