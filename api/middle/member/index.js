const { camelizeKeys } = require('humps')
const { find, get, mapKeys } = require('lodash')
const { handlerError } = require('../../comm')
const config = require('../../config')
const debug = require('debug')('READR:api:member')
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
  const url = get(req, 'query.keyword') ? `${apiHost}/members/nickname`: `${apiHost}/members`
  get(req, 'query.keyword') && (payload.fields = JSON.stringify([ 'id', 'nickname', 'mail', 'role', 'custom_editor', ]))

  debug('payload', get(req, 'body.keyword'))
  debug(payload)

  superagent
  .get(url)
  .query(payload)
  .end((error, response) => {
    if (!error && response) {
      debug('Fetch member list from api successfully.')
      // debug(response.body)
      res.send(camelizeKeys(response.body))
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during fetch data from : ${url}`)
      console.error(error) 
    }
  })
})

router.post('/create', (req, res) => {
  debug('Got a member creating call.')
  debug(req.body)
  // res.send('ok')
  const url = `${apiHost}/member`
  superagent
  .post(url)
  .send(req.body)
  .end((error, response) => {
    if (!error && response) {
      res.send({ status: 200, text: 'Create a new member successfully.' })
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during create a new member : ${url}`)
      console.error(error) 
    }
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
  const id = get(req, 'body.id')
  const url = `${apiHost}/member/${id}`
  debug(url)
  superagent
  .delete(url)
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

router.get('/count', (req, res) => {
  const url = `${apiHost}/members${req.url}`
  debug(req.url)
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
})

module.exports = router
