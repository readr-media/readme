const { camelizeKeys } = require('humps')
const { find, get, map, mapKeys } = require('lodash')
const { handlerError } = require('../../comm')
const config = require('../../config')
const debug = require('debug')('README:api:report')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')

const jwtExpress = require('express-jwt')
const authVerify = jwtExpress({ secret: config.JWT_SECRET })
const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.get('/list', (req, res) => {
  const url = `${apiHost}/report${req.url}`

  debug('Got a /report/list call:')
  debug(req.url)
  debug(req.body)

  superagent
  .get(url)
  .end((error, response) => {
    if (!error && response) {
      debug('Fetch report list from api successfully.')
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

const updateAuthors = (req, res) => {
  debug('Going to update authors.')
  const url = `${apiHost}/report/author`
  const payload = {
    report_id: get(req.body, 'id'),
    author_ids: map(get(req.body, 'authors'), a => a.value),
  }

  superagent
  .put(url)
  .send(payload)
  .end((error, response) => {
    if (!error) {
      res.send({ status: 200, text: 'Updating a report successfully.' })
    } else {
      /**
       * Error occurred when updating report authors.
       */
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during updating report authors: ${get(req.body, 'id')}`)
      console.error(error)         
    }
  })
}
router.post('/create', (req, res, next) => {
  debug('Got a report creating call.')
  debug(req.body)

  const url = `${apiHost}/report`
  superagent
  .post(url)
  .send(req.body)
  .end((error, response) => {
    if (!error && response) {
      debug('response', response.body)
      /**
       * Creating a new report successfully, then go next to update authors.
       */
      req.body.id = get(response, 'body._items.last_id')
      next()
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during create a new report : ${req.body}`)
      console.error(error) 
    }
  })
}, updateAuthors)

router.put('/update', (req, res, next) => {
  debug('Got a report updating call.')
  debug(req.body)

  const url = `${apiHost}/report`
  superagent
  .put(url)
  .send(req.body)
  .end((error, response) => {
    if (!error) {
      /**
       * Updating report successfully, then go next to update authors.
       */
      next()
    } else {
      /**
       * Error occurred when updating report.
       */
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during updating report: ${get(req.body, 'id')}`)
      console.error(error)       
    }
  })
}, updateAuthors)

router.delete('/', (req, res) => {
  debug('Got a report del call.')
  debug(req.body)


  const ids = get(req, 'body.ids', [])

  Promise.all(map(ids, id => new Promise(resolve => {
    const url = `${apiHost}/report/${id}`
    debug('MEMBER### DELETING REJECT:', id)
    
    superagent
    .delete(url)
    .end((error, response) => {
      if (error) {
        console.error('Error occurred during deleting report', id)
        console.error(error)     
      }
      resolve()
    })
  }).catch(error => {
    console.error('Error occurred during deleting report', id)
    console.error(error)    
  }))).then(() => {
    res.send({ status: 200, text: 'Done.' })
  }).catch(err => {
    const errWrapped = handlerError(err)
    res.status(errWrapped.status).send({
      status: errWrapped.status,
      text: errWrapped.text
    })
    console.error(`Error occurred during deleting report: ${ids}`)
    console.error(err)     
  })
})

module.exports = router
