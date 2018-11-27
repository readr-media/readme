// const debug = require('debug')('CLIENT:mutations:list')

const SET_LIST_ITEMS_COUNT = (state, { count, }) => {
  state[ 'listItemsCount' ] = count
}

const SET_VALUE = (state, { active, type, value, }) => {
  state[ 'valueSetter' ] = {
    active,
    type,
    value
  }
}

export {
  SET_LIST_ITEMS_COUNT,
  SET_VALUE,
}