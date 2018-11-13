const { camelizeKeys } = require('humps')
const { find, get, map, mapKeys } = require('lodash')
const { handlerError } = require('../comm')
const config = require('../config')
const debug = require('debug')('README:api:project')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const jwtExpress = require('express-jwt')
const authVerify = jwtExpress({ secret: config.JWT_SECRET })
const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.get('/list', (req, res) => {
  const url = `${apiHost}/project${req.url}`

  debug('Got a /project/list call:')
  debug(req.url)
  debug(req.body)

  superagent
  .get(url)
  .end((error, response) => {
    if (!error && response) {
      debug('Fetch project list from api successfully.')
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
  debug('Got a project creating call.')
  debug(req.body)
  // res.send('ok')
  const url = `${apiHost}/project`
  superagent
  .post(url)
  .send(req.body)
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
  })
})

router.put('/update', (req, res) => {
  debug('Got a project updating call.')
  const url = `${apiHost}/project`
  debug(req.body)
  superagent
  .put(url)
  .send(req.body)
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
  })
})

router.delete('/', (req, res) => {
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
  }).catch(err => {
    const errWrapped = handlerError(err)
    res.status(errWrapped.status).send({
      status: errWrapped.status,
      text: errWrapped.text
    })
    console.error(`Error occurred during deleting project: ${ids}`)
    console.error(err)     
  })
})

module.exports = router
