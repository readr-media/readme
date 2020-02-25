const { camelizeKeys } = require('humps')
const { find, get, map, mapKeys } = require('lodash')
const { handlerError } = require('../../comm')
const { sendInvitationEmail, } = require('./comm')
const config = require('../../config')
const debug = require('debug')('README:api:member')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const jwtExpress = require('express-jwt')
const authVerify = jwtExpress({ secret: config.JWT_SECRET })
const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.use('/list', (req, res) => {
  debug('Got a /member/list call:')
  debug(req.url)
  debug(req.query)
  debug(req.body)

  const payload = Object.assign({}, req.query)
  const url = get(req, 'query.keyword') ? `${apiHost}/members/nickname` : `${apiHost}/members`
  get(req, 'query.keyword') && (payload.fields = JSON.stringify([ 'id', 'nickname', 'mail', 'role', 'custom_editor', ]))

  debug('payload', get(req, 'body.keyword'))
  debug(payload)

  superagent
  .get(url)
  .query(payload)
  .end((error, response) => {
    if (!error && response) {
      debug('Fetch /members from api successfully.')
      res.send(camelizeKeys(response.body))
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during fetch data from: ${url}`)
      console.error(error) 
    }
  })
})

router.get('/filter', (req, res) => {
  const url = `${apiHost}/members${req.url}`
  debug(`Got a /member/filter call: ${url}`)
  
  superagent
  .get(url)
  .end((error, response) => {
    if (!error && response) {
      debug('Fetch /member/filter from api successfully.')
      res.send(camelizeKeys(response.body))
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during fetch data from: ${url}`)
      console.error(error) 
    }
  })
})

router.get('/item/:id', (req, res) => {
  const id = req.params.id
  const url = `${apiHost}/member/${id}`
  debug(`Got a /member/item/:id call: ${url}`)
  
  superagent
  .get(url)
  .end((error, response) => {
    if (!error && response) {
      debug('Fetch /member/:id from api successfully.')
      res.send(camelizeKeys(response.body))
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during fetch data from: ${url}`)
      console.error(error) 
    }
  })
})

router.post('/create', (req, res, next) => {
  debug('Got a member creating call.')
  debug(req.body)

  const payload = Object.assign({}, req.body)
  const url = `${apiHost}/member`
  delete payload.id
  payload.active = 0
  payload.register_mode = 'ordinary'

  debug('payload:')
  debug(payload)

  superagent
    .post(url)
    .send(payload)
    .end((err, resp) => {
      if (!err) {
        debug('Added member by Admin successfully.')
        /**
         * Next to send a verification email to new member.
         */
        next()
      } else {
        const errWrapped = handlerError(err, resp)
        res.status(errWrapped.status).send({
          status: errWrapped.status,
          text: errWrapped.text
        })
        console.error(`Error occurred when creating new member: ${url}`)
        console.error(err)         
      }
    })
}, (req, res) => {
  sendInvitationEmail({
    id: req.body.mail,
    email: req.body.mail,
    role: req.body.role,
    type: 'init',
  }).then(outcome => {
    debug('A member added by Admin')
    debug('outcome')
    // debug(outcome)
    res.status(200).end()    
  }).catch(outcome => {
    const errWrapped = handlerError(outcome.err, outcome.res)
    res.status(errWrapped.status).send({
      status: errWrapped.status,
      text: errWrapped.text
    })
    console.error(`Error occurred when creating new member: ${url}`)
    console.error(outcome.err)        
  })
})

router.put('/update', (req, res) => {
  debug('Got a member updating call.')
  debug(req.body)
  const url = `${apiHost}/member`
  superagent
  .put(url)
  .send(req.body)
  .end((error, response) => {
    if (!error && response) {
      res.send({ status: 200, text: 'Updating a new member successfully.' })
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during update member: ${url}`)
      console.error(error) 
    }
  })
})

router.delete('/', (req, res) => {
  debug('Got a proj del call.')
  debug(req.body)
  const ids = get(req, 'body.ids', [])
  
  
  Promise.all(map(ids, id => new Promise(resolve => {
    const url = `${apiHost}/member/${id}`
    debug('MEMBER### DELETING MEMBER:', id)
    
    superagent
    .delete(url)
    .end((error, response) => {
      if (error) {
        console.error('Error occurred during deleting member', id)
        console.error(error)     
      }
      resolve()
    })
  }).catch(error => {
    console.error('Error occurred during deleting member', ids)
    console.error(error)    
  }))).then(() => {
    res.send({ status: 200, text: 'Done.' })
  }).catch(err => {
    const errWrapped = handlerError(err)
    res.status(errWrapped.status).send({
      status: errWrapped.status,
      text: errWrapped.text
    })
    console.error(`Error occurred during deleting member: ${ids}`)
    console.error(err)     
  })
})

const _fetch = (url, { res, }) => {
  superagent
  .get(url)
  .end((error, response) => {
    if (!error && response) {
      debug('Fetch memo count from api successfully.')
      // debug(response.text)
      res.send(camelizeKeys(response.body))
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during fetching data from : ${url}`)
      console.error(error) 
    }
  })
}

router.use('/nickname/list', (req, res) => {
  debug('Go get nickname list', req.url)
  const url = `${apiHost}/members/nickname${req.url}`
  _fetch(url, { res, })
})

router.get('/count', (req, res) => {
  const url = `${apiHost}/members${req.url}`
  debug(req.url)
  _fetch(url, { res, })
})

module.exports = router
