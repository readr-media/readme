const { camelizeKeys } = require('humps')
const { get, map } = require('lodash')
const { handlerError } = require('../comm')

const config = require('../config')
const debug = require('debug')('README:api:promotion')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT


router.use('/list', (req, res) => {
  const url = `${apiHost}/promotions${req.url.slice(1)}&active=$in:1&total=true`

  superagent
    .get(url)
    .end((error, response) => {
      if (!error && response) {
        debug('Fetch promotions from api successfully.')
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
  const url = `${apiHost}/promotions`
  req.body.updated_by = `${req.user.id}`
  superagent
    .post(url)
    .send(req.body)
    .end((error, response) => {
      if (!error && response) {
        res.send({ status: 200, text: 'Create a new promotion successfully.' })
      } else {
        const errWrapped = handlerError(error, response)
        res.status(errWrapped.status).send({
          status: errWrapped.status,
          text: errWrapped.text
        })
        console.error(`Error occurred during create a new promotion : ${url}`)
        console.error(error) 
      }
      req.outcome = response
      next()
    })
})

router.put('/update', (req, res, next) => {
  const url = `${apiHost}/promotions`
  req.body.updated_by = `${req.user.id}`
  superagent
    .put(url)
    .send(req.body)
    .end((error, response) => {
      if (!error && response) {
        res.send({ status: 200, text: 'Updating a promotion successfully.' })
      } else {
        const errWrapped = handlerError(error, response)
        res.status(errWrapped.status).send({
          status: errWrapped.status,
          text: errWrapped.text
        })
        console.error(`Error occurred during updating promotion : ${url}`)
        console.error(error) 
      }
      req.outcome = response
      next()
    })
})

router.delete('/', (req, res, next) => {
  const ids = get(req, 'body.ids', [])
  debug('delete', ids)
  Promise.all(map(ids, id => new Promise(resolve => {
    const url = `${apiHost}/promotions/${id}`
    superagent
      .delete(url)
      .end((error, response) => {
        if (error) {
          console.error('Error occurred during deleting promotion', id)
          console.error(error)     
        }
        resolve()
      })
  }).catch(error => {
    console.error('Error occurred during deleting promotion', id)
    console.error(error)
  }))).then(() => {
    res.send({ status: 200, text: 'Done.' })
    req.outcome = { status: 200 }
    next()
  }).catch(err => {
    const errWrapped = handlerError(err)
    const outcome = { status: errWrapped.status, text: errWrapped.text }
    console.error(`Error occurred during deleting promotion: ${ids}`)
    console.error(err)     
    res.status(errWrapped.status).send(outcome)
    req.outcome = outcome
    next()
  })
})

module.exports = router
