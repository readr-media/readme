import { fetchItem, updateItem, postItem, delItems } from 'src/api/item'
import { get, } from 'lodash'
const debug = require('debug')('CLIENT:store:actions:item')

const FETCH_ITEM = ({ commit }, { id, params, endpoint }) => {
  return fetchItem({ id, params, endpoint }).then(({ body }) => {
    const item = get(body, 'items.0', {})
    return item
  })
}

const UPDATE_ITEM = ({ commit, }, { params, endpoint, }) => {
  console.log('UPDATE_ITEM', endpoint)

  return updateItem({ params, endpoint, }).then(({ status, body, }) => {
    debug('{ params, endpoint }', { params, endpoint })
    return { status, }
  }).catch(err => {
    debug('Error ocurred!', err)
    return Promise.reject(err)
  })
}
const POST_ITEM = ({ commit, }, { params, endpoint, }) => {
  return postItem({ params, endpoint, }).then(({ status, body, }) => {
    debug('{ params, endpoint }', { params, endpoint })
    return { status, body, params }
  }).catch(err => {
    debug('Error ocurred!', err)
    return Promise.reject(err)
  })
}
// const DEL_ITEM = ({ commit, }, { params, endpoint, }) => {
//   return delItem({ params, endpoint, }).then(({ status, body, }) => {
//     debug('{ params, endpoint }', { params, endpoint })
//     return { status, }
//   }).catch(err => {
//     debug('Error ocurred!', err)
//     return Promise.reject(err)
//   })
// }

const DEL_ITEMS = ({ commit, }, { params, endpoint, }) => {
  return delItems({ params, endpoint, }).then(({ status, body, }) => {
    debug('{ params, endpoint }', { params, endpoint })
    return { status, }
  }).catch(err => {
    debug('Error ocurred!', err)
    return Promise.reject(err)
  })
}

// const GET_ITEMS_COUNT = ({ commit, }, { params, endpoint, }) => {
//   return getItemCount({ params, endpoint, }).then(({ status, body, }) => {
//     debug('{ params, endpoint }', { params, endpoint })
//     if (status === 200) {
//       commit('SET_LIST_ITEMS_COUNT', { count: get(body, 'meta.total') })
//     }    
//     return { status, }
//   }).catch(err => {
//     debug('Error ocurred!', err)
//     return Promise.reject(err)
//   })
// }

export {
  FETCH_ITEM,
  UPDATE_ITEM,
  POST_ITEM,
  // DEL_ITEM,
  DEL_ITEMS,
  // GET_ITEMS_COUNT,
}