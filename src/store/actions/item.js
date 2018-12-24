import * as itemFunc from 'src/api/item'
import { get, } from 'lodash'
const debug = require('debug')('CLIENT:store:actions:item')

const UPDATE_ITEM = ({ commit, }, { params, endpoint, }) => {
  console.log('UPDATE_ITEM', endpoint)

  return itemFunc.updateItem({ params, endpoint, }).then(({ status, body, }) => {
    debug('{ params, endpoint }', { params, endpoint })
    return { status, }
  }).catch(err => {
    debug('Error ocurred!', err)
    return Promise.reject(err)
  })
}
const POST_ITEM = ({ commit, }, { params, endpoint, }) => {
  return itemFunc.postItem({ params, endpoint, }).then(({ status, body, }) => {
    debug('{ params, endpoint }', { params, endpoint })
    return { status, body }
  }).catch(err => {
    debug('Error ocurred!', err)
    return Promise.reject(err)
  })
}
// const DEL_ITEM = ({ commit, }, { params, endpoint, }) => {
//   return itemFunc.delItem({ params, endpoint, }).then(({ status, body, }) => {
//     debug('{ params, endpoint }', { params, endpoint })
//     return { status, }
//   }).catch(err => {
//     debug('Error ocurred!', err)
//     return Promise.reject(err)
//   })
// }

const DEL_ITEMS = ({ commit, }, { params, endpoint, }) => {
  return itemFunc.delItems({ params, endpoint, }).then(({ status, body, }) => {
    debug('{ params, endpoint }', { params, endpoint })
    return { status, }
  }).catch(err => {
    debug('Error ocurred!', err)
    return Promise.reject(err)
  })
}

const GET_ITEMS_COUNT = ({ commit, }, { params, endpoint, }) => {
  return itemFunc.getItemCount({ params, endpoint, }).then(({ status, body, }) => {
    debug('{ params, endpoint }', { params, endpoint })
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
  // DEL_ITEM,
  DEL_ITEMS,
  GET_ITEMS_COUNT,
}