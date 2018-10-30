const { get, } = require('lodash')
const debug = require('debug')('README:api:comm')

const handlerError = (err, res) => {
  debug('err:')
  debug(err)
  return {
    status: (typeof(get(res, 'status')) === 'number' && get(res, 'status')) || get(err, 'status') || 500,
    text: get(err, 'message', ''),
  }
}
module.exports = {
  handlerError,
}
