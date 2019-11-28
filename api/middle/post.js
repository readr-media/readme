const { camelizeKeys } = require('humps')
const { constructFileInfo, transferFileToStorage } = require('./assets/comm')
const { handlerError } = require('../comm')
const { get, map } = require('lodash')
const config = require('../config')
const debug = require('debug')('README:api:post')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.use('/list', (req, res) => {
  const url = `${apiHost}/posts${req.url.slice(1)}&show_tag=true&show_author=true&type={"$in":[0,1,2,3,4,5]}`
  debug('Got a /post call:')
  debug(url)
  superagent
  .get(url)
  .end((error, response) => {
    if (!error && response) {
      debug('Fetch posts from api successfully.')
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
  debug('Got a post creating call.')
  debug(req.body)
  // res.send('ok')
  const url = `${apiHost}/post`
  req.body.updated_by = req.user.id
  const payload = Object.assign({}, req.body)
  superagent
  .post(url)
  .send(payload)
  .end((error, response) => {
    if (!error && response) {
      res.send({ status: 200, text: 'Create a new post successfully.' })
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during create a new post : ${url}`)
      console.error(error) 
    }
    req.outcome = response
    next()
  })
})
router.put('/update', (req, res, next) => {  
  const url = `${apiHost}/post`
  debug('Got a post updating call.')
  debug('req.body', req.body)
  const payload = Object.assign({}, req.body)
  payload.updated_by = req.user.id
  superagent
  .put(url)
  .send(payload)
  .end((error, response) => {
    if (!error && response) {
      res.send({ status: 200, text: 'Updating a post successfully.' }) 
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during post project: ${url}`)
      console.error(error) 
    }
    req.outcome = response
    next()
  })
})
router.get('/count', (req, res) => {
  const url = `${apiHost}/posts/count`
  superagent
  .get(url)
  .end((error, response) => {
    if (!error && response) {
      debug('Fetch posts count from api successfully.')
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
router.delete('/', (req, res, next) => {
  debug('Got a post del call.')
  debug(req.body)
  const ids = get(req, 'body.ids', [])
  Promise.all(map(ids, id => new Promise(resolve => {
    const url = `${apiHost}/post/${id}`
    debug('MEMBER### DELETING POST:', id)
    
    superagent
    .delete(url)
    .end((error, response) => {
      if (error) {
        console.error('Error occurred during deleting post', id)
        console.error(error)     
      }
      resolve()
    })
  }).catch(error => {
    console.error('Error occurred during deleting post', id)
    console.error(error)    
  }))).then(() => {
    res.send({ status: 200, text: 'Done.' })
    req.outcome = { status: 200 }
    next()
  }).catch(err => {
    const errWrapped = handlerError(err)
    const outcome = { status: errWrapped.status, text: errWrapped.text }
    console.error(`Error occurred during deleting post: ${ids}`)
    console.error(err)     
    res.status(errWrapped.status).send(outcome)
    req.outcome = outcome
    next()
  })
})
module.exports = router
