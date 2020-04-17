const { get, } = require('lodash')
const debug = require('debug')('README:api:comm')

const isValidJSONString = str => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}
const handlerError = (err, res) => {
  debug('err:')
  debug(err)
  const text = get(res, 'text') || get(err, 'response.message') || get(err, 'message')
  return {
    status: (typeof(get(res, 'status')) === 'number' && get(res, 'status')) || get(err, 'status') || 500,
    text: (isValidJSONString(text) || typeof text === 'string') ? text : `{}`,
  }
}

module.exports = {
  handlerError,
}
