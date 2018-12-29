import { constructUrlWithQuery, del, fetchInStrict, put, post, } from 'src/api/comm'
import { getHost, } from 'src/util/comm'
const debug = require('debug')('CLIENT:api:item')
const host = getHost()

export function updateItem ({ params, endpoint, }) {
  console.log('UPDATE_ITEM', endpoint)
  debug('update', endpoint)
  const url = `${host}/api/${endpoint}/update`
  return put(url, params)
}

export function postItem ({ params, endpoint, }) {
  const url = `${host}/api/${endpoint}/create`
  params.active = 1
  return post(url, params) 
}

// export function delItem ({ params, endpoint, }) {
//   const targetApi = get(filter(apiMap, { item: endpoint, method: 'DELETE', }), '0.target')
//   const url = `${host}/api/${targetApi}`
//   return targetApi ? del(url, params) : Promise.reject({ status: '400', message: '"targetApi" Not Found.', })
// }

export function delItems ({ params, endpoint, }) {
  const url = `${host}/api/${endpoint}`
  return del(url, params)
}

export function getItemCount ({ params, endpoint, }) {
  const url = constructUrlWithQuery(`${host}/api/${endpoint}/count`, params)
  return fetchInStrict(url, params)
}
