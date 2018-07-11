
import * as listFunc from 'src/api/list'
import { get, } from 'lodash'
const debug = require('debug')('CLIENT:store:actions:list')
const FETCH_LIST = ({ commit, }, { params, flag, }) => {
  return listFunc.fetchList({ params, flag }).then(({ status, body, }) => {
    if (status === 200) {
      commit('SET_LIST', { items: get(body, 'items') })
    }
    return { status, }
  })
}

export {
  FETCH_LIST,
}