const Cookies = require('cookies')
const config = require('../../config')
const debug = require('debug')('READR:api:member:activation')
const express = require('express')
const jwtService = require('../../services')
const router = express.Router()
const superagent = require('superagent')
const { fetchMem, } = require('./comm')
const { get, } = require('lodash')
const { handlerError, } = require('../../comm')
const { setupClientCache } = require('../comm')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

const activateMem = (member) => new Promise((resolve, reject) => {
  const url = `${apiHost}/member`
  const payload = {
    id: member.id,
    role: member.role || 1,
    active: 1,
  }
  superagent
    .put(url)
    .send(payload)
    .end((err, res) => {
      debug('Finished avtivating the member', member.id)
      if (!err) {
        resolve({ res, })
      } else {
        reject({ err, res, })
      }
    })
})

const activate = (req, res) => {
  debug('req.url', req.url)
  const decoded = req.decoded

  fetchMem(decoded)
  .then(({ res: data, }) => {
    debug('Fecth member data sucessfully.')
    const member = get(data, 'body._items.0')
    debug('data', get(data, 'body._items.0.active'))
    debug('decoded.type', decoded.type)
    if (get(member, 'active') === 0) {
      if (decoded.type !== 'init') {
        debug('About to send req to activate mem')
        activateMem(member)
        .then(({ res: r, }) => {
          res.redirect(302, '/login')
        }).catch(({ err: e, res: r, }) => {
          const errWrapped = handlerError(e, r)
          res.status(errWrapped.status).send({
            status: errWrapped.status,
            text: errWrapped.text
          })
          console.error(`Error occurred when creating new member: ${url}`)
          console.error(e)                  
        })
      } else {
        debug('Redirect user to fill in basic info.')
        const tokenForActivation = jwtService.generateActivateAccountJwt({
          id: decoded.id,
          role: decoded.role || 1,
          type: decoded.type, // this type should be 'init'
        })
        const cookies = new Cookies( req, res, {} )
        cookies.set('setup', tokenForActivation, {
          httpOnly: false,
          domain: config.DOMAIN,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
        res.redirect(302, '/setup/init')
      }
    } else {
      res.redirect(302, '/')
    }
  })
  .catch(({ err, res: response, }) => {
    const err_wrapper = handlerError(err, response)
    res.status(err_wrapper.status).send(err_wrapper.text)
    console.error(`Error occurred during Sending acks to Pub/sub center`)
    console.error(err)
  })
}

router.get('*', setupClientCache, (req, res, next) => {
  const decoded = req.decoded
  if (!decoded.type) {
    res.status(403).send(`Invalid activation token.`)
  } else {
    next()
  }
}, activate)

module.exports = router
