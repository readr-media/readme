const { camelizeKeys } = require('humps')
const { handlerError } = require('../comm')
const { get, map } = require('lodash')
const config = require('../config')
const debug = require('debug')('README:api:poll')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.use('/list', (req, res) => {
  const url = `${apiHost}/posts${req.url.slice(1)}&show_tag=true&show_author=true`
  debug('Got a /post call:')
  debug(req.url)
  
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
router.post('/create', (req, res) => {
  debug('Got a post creating call.')
  debug(req.body)
  // res.send('ok')
  const url = `${apiHost}/post`
  req.body.author = req.user.id

  superagent
  .post(url)
  .send(req.body)
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
  })
})
router.put('/update', (req, res) => {  
  const url = `${apiHost}/post`
  debug('Got a post updating call.')
  debug('req.body', req.body)

  superagent
  .put(url)
  .send(req.body)
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
router.delete('/', (req, res) => {
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
  }).catch(err => {
    const errWrapped = handlerError(err)
    res.status(errWrapped.status).send({
      status: errWrapped.status,
      text: errWrapped.text
    })
    console.error(`Error occurred during deleting post: ${ids}`)
    console.error(err)     
  })
})
module.exports = router
