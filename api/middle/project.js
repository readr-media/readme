const { camelizeKeys } = require('humps')
const { get, map } = require('lodash')
const { handlerError } = require('../comm')
const config = require('../config')
const debug = require('debug')('README:api:project')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.get('/list', (req, res) => {
  const url = `${apiHost}/project${req.url.slice(1)}`

  debug('Got a /project/list call:')
  debug(req.url)
  debug(req.body)

  superagent
  .get(url)
  .end((error, response) => {
    if (!error && response) {
      debug('Fetch /project/list from api successfully.')
      // debug(response.body)
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

router.use('/filter', (req, res) => {
  const url = `${apiHost}/project/filter${req.url.slice(1)}`
  
  debug('Got a /project/filter call:')
  debug(url)
  superagent
  .get(url)
  .end((error, response) => {
    if (!error && response) {
      debug('Fetch /project/filter from api successfully.')
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
  debug('Got a project creating call.')
  debug(req.body)

  const payload = Object.assign({}, req.body)
  const url = `${apiHost}/project`
  delete payload.id

  superagent
  .post(url)
  .send(payload)
  .end((error, response) => {
    if (!error && response) {
      res.send({ status: 200, text: 'Create a new project successfully.' }) 
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during create a new project : ${url}`)
      console.error(error) 
    }
    req.outcome = response
    next()
  })
})

router.put('/update', (req, res, next) => {
  debug('Got a project updating call.')
  const url = `${apiHost}/project`
  debug(req.body)
  
  const payload = Object.assign({}, req.body)
  superagent
  .put(url)
  .send(payload)
  .end((error, response) => {
    if (!error && response) {
      res.send({ status: 200, text: 'Updating a project successfully.' })
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during update project: ${url}`)
      console.error(error) 
    }
    req.outcome = response
    next()
  })
})

router.delete('/', (req, res, next) => {
  debug('Got a proj del call.')
  debug(req.body)
  const ids = get(req, 'body.ids', [])
  Promise.all(map(ids, id => new Promise(resolve => {
    const url = `${apiHost}/project/${id}`
    debug('MEMBER### DELETING PROJECT:', id)
    
    superagent
    .delete(url)
    .end((error, response) => {
      if (error) {
        console.error('Error occurred during deleting project', id)
        console.error(error)     
      }
      resolve()
    })
  }).catch(error => {
    console.error('Error occurred during deleting project', id)
    console.error(error)    
  }))).then(() => {
    res.send({ status: 200, text: 'Done.' })
    req.outcome = { status: 200 }
    next()
  }).catch(err => {
    const errWrapped = handlerError(err)
    const outcome = { status: errWrapped.status, text: errWrapped.text }
    console.error(`Error occurred during deleting project: ${ids}`)
    console.error(err)     
    res.status(errWrapped.status).send(outcome)
    req.outcome = outcome
    next()
  })
})

module.exports = router
