
import * as listFunc from 'src/api/list'
import { get, } from 'lodash'
const debug = require('debug')('CLIENT:store:actions:list')
const FETCH_LIST = ({ commit, }, { params, flag, }) => {
  debug('params', params)
  debug('flag', flag)
  return listFunc.fetchList({ params, flag, }).then(({ status, body, }) => {
    if (status === 200) {
      commit('SET_LIST', { items: get(body, 'items'), })
    }
    return { status, items: get(body, 'items'), }
  })
}
const FETCH_AUTOCOMPLETE_LIST = ({ commit, }, { params, flag, }) => {
  return listFunc.fetchList({ params, flag }).then(({ status, body, }) => {
    return { status, items: get(body, 'items'), }
  })
}

export {
  FETCH_LIST,
  FETCH_AUTOCOMPLETE_LIST
}