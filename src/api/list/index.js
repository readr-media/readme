import { apiMap, } from 'src/api/list/map'
import { constructUrlWithQuery, fetchInStrict, } from 'src/api/comm'
import { filter, get, } from 'lodash'
import { getHost, } from 'src/util/comm'
const debug = require('debug')('CLIENT:api:list')
const host = getHost()

export function fetchList ({ params, flag, }) {
  const targetApi = get(filter(apiMap, { item: flag, }), '0.target')
  debug('parmas', params)
  debug('flag', flag)
  debug('targetApi', targetApi)
  if (!targetApi) { return Promise.reject() }
  const url = constructUrlWithQuery(`${host}/api/${targetApi}`, params)
  return fetchInStrict(url, {})
}
