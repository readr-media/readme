const config = require('../../config')
const debug = require('debug')('README:api:gcLogger')
const express = require('express')
const router = express.Router()
const { trace } = require('./comm')

router.post('/', (req, res) => {
  debug('Got Logging call!(from ip', req.clientIp, ')')
  trace(Object.assign({}, req.body, { ip: req.clientIp, }) || {})
  /**
   * response whatever, it doesn't matter if logging in fail
   */
  res.send({ msg: 'Got a loggin req.', })
})

module.exports = router