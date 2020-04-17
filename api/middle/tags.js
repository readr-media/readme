const { camelizeKeys } = require('humps')
const { handlerError } = require('../comm')
const config = require('../config')
const debug = require('debug')('README:api:tag')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.use('/list', (req, res) => {
  const url = `${apiHost}/tags${req.url.slice(1)}`
  debug('Got a /tags call:')
  debug(req.url)
  debug(req.body)
  
  superagent
  .get(url)
  .end((error, response) => {
    if (!error && response) {
      debug('Fetch tags from api successfully.')
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

router.post('/create', (req, res, next) => {
  const url = `${apiHost}/tags`
  req.body.updated_by = req.user.id
  superagent
    .post(url)
    .send(req.body)
    .end((error, response) => {
      if (!error && response) {
        res.send({ status: 200, text: 'Create new tags successfully.' })
      } else {
        const errWrapped = handlerError(error, response)
        res.status(errWrapped.status).send({
          status: errWrapped.status,
          text: errWrapped.text
        })
        console.error(`Error occurred during create new tags : ${url}`)
        console.error(error) 
      }
      req.outcome = response
    })
})

router.put('/update', (req, res) => {
  const url = `${apiHost}/tags`
  req.body.updated_by = req.user.id
  superagent
    .put(url)
    .send(req.body)
    .end((error, response) => {
      if (!error && response) {
        res.send({ status: 200, text: 'Updating tags successfully.' })
      } else {
        const errWrapped = handlerError(error, response)
        res.status(errWrapped.status).send({
          status: errWrapped.status,
          text: errWrapped.text
        })
        console.error(`Error occurred during updating tags : ${url}`)
        console.error(error) 
      }
      req.outcome = response
    })
})

router.delete('/', (req, res, next) => {
  if (req.body.ids.length > 0) {
    req.body.ids = req.body.ids.map(id => Number(id))
  }
  const url = `${apiHost}/tags?ids=[${req.body.ids}]&updated_by=${req.user.id}`
  superagent
    .delete(url)
    .end((error, response) => {
      if (!error && response) {
        res.send({ status: 200, text: 'Done.' })
        req.outcome = { status: 200 }
      } else {
        const errWrapped = handlerError(error)
        const outcome = { status: errWrapped.status, text: errWrapped.text }
        console.error(`Error occurred during deleting tags: ${req.body}`)
        console.error(error)     
        res.status(errWrapped.status).send(outcome)
        req.outcome = outcome
      }
    })
})

router.get('/count', (req, res) => {
  const url = `${apiHost}/tags/count`
  superagent
  .get(url)
  .end((error, response) => {
    if (!error && response) {
      debug('Fetch tags count from api successfully.')
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

module.exports = router
