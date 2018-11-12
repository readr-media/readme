// const debug = require('debug')('CLIENT:mutations:list')

const SET_LIST_ITEMS_COUNT = (state, { count, }) => {
  state[ 'listItemsCount' ] = count
}

export {
  SET_LIST_ITEMS_COUNT,
}