
import { fetchList, fetchFilteredList, fetchChoices } from 'src/api/list'
import { get, } from 'lodash'

const debug = require('debug')('CLIENT:store:actions:list')

const FETCH_LIST = ({ commit, }, { params, endpoint, type }) => {
  debug('params', params)
  debug('endpoint', endpoint)
  
  return fetchList({ params, endpoint, }).then(({ status, body, }) => {
    if (status === 200 && type === 'LITING_PAGE') {
      const count = get(body, 'meta.total', 0)
      commit('SET_LIST', { items: get(body, 'items') })
      if (count) {
        commit('SET_LIST_ITEMS_COUNT', { count })
      }
    }
    return { status, items: get(body, 'items') }
  })
}

const FETCH_FILTERED_LIST = ({ commit }, { params, endpoint }) => {
  debug('params', params)
  debug('endpoint', endpoint)
  
  return fetchFilteredList({ params, endpoint }).then(({ body }) => {
    const count = get(body, 'meta.total', 0)
    commit('SET_LIST', { items: get(body, 'items') })
    commit('SET_LIST_ITEMS_COUNT', { count })
  })
}

const FETCH_AUTOCOMPLETE_LIST = ({ commit, }, { params, endpoint, }) => {
  return fetchList({ params, endpoint }).then(({ status, body, }) => {
    return { status, items: get(body, 'items'), }
  })
}

const FETCH_CHOICES = ({ commit, }, { id, params, endpoint, }) => {
  return fetchChoices({ id, params, endpoint }).then(({ status, body, }) => {
    return { status, items: get(body, 'items'), }
  })
}

export {
  FETCH_CHOICES,
  FETCH_LIST,
  FETCH_FILTERED_LIST,
  FETCH_AUTOCOMPLETE_LIST
}