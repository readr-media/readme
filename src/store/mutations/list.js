// const debug = require('debug')('CLIENT:mutations:list')

const SET_LIST = (state, { items, }) => {
  state['list'] = items
}

export {
  SET_LIST,
}