import * as itemFunc from 'src/api/item'
import { get, } from 'lodash'
const debug = require('debug')('CLIENT:store:actions:item')

const UPDATE_ITEM = ({ commit, }, { params, flag, }) => {
  return itemFunc.updateItem({ params, flag, }).then(({ status, body, }) => {
    debug('{ params, flag }', { params, flag })
    return { status, }
  }).catch(err => {
    debug('Error ocurred!', err)
    return Promise.reject(err)
  })
}
const POST_ITEM = ({ commit, }, { params, flag, }) => {
  return itemFunc.postItem({ params, flag, }).then(({ status, body, }) => {
    debug('{ params, flag }', { params, flag })
    return { status, }
  }).catch(err => {
    debug('Error ocurred!', err)
    return Promise.reject(err)
  })
}
const DEL_ITEM = ({ commit, }, { params, flag, }) => {
  return itemFunc.delItem({ params, flag, }).then(({ status, body, }) => {
    debug('{ params, flag }', { params, flag })
    return { status, }
  }).catch(err => {
    debug('Error ocurred!', err)
    return Promise.reject(err)
  })
}

const GET_ITEMS_COUNT = ({ commit, }, { params, flag, }) => {
  return itemFunc.getItemCount({ params, flag, }).then(({ status, body, }) => {
    debug('{ params, flag }', { params, flag })
    if (status === 200) {
      commit('SET_LIST_ITEMS_COUNT', { count: get(body, 'meta.total') })
    }    
    return { status, }
  }).catch(err => {
    debug('Error ocurred!', err)
    return Promise.reject(err)
  })
}

export {
  UPDATE_ITEM,
  POST_ITEM,
  DEL_ITEM,
  GET_ITEMS_COUNT,
}