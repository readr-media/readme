import { constructUrlWithQuery, fetchInStrict, } from 'src/api/comm'
import { getHost, } from 'src/util/comm'
const debug = require('debug')('CLIENT:api:list')
const host = getHost()

export function fetchList ({ params, endpoint, }) {
  debug('parmas', params)
  debug('endpoint', endpoint)
  const url = constructUrlWithQuery(`${host}/api/${endpoint}/list`, params)
  return fetchInStrict(url, {})
}
