const { camelizeKeys } = require('humps')
const { find, get, map, mapKeys } = require('lodash')
const { handlerError } = require('../../comm')
const config = require('../../config')
const debug = require('debug')('README:api:memo')
const express = require('express')
const router = express.Router()
const superagent = require('superagent')
const axios = require('axios')

const jwtExpress = require('express-jwt')
const authVerify = jwtExpress({ secret: config.JWT_SECRET })
const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.use('/list', (req, res) => {
  const url = `${apiHost}/memos${req.url}`

  debug('Got a /memo/list call:')
  debug(req.url)
  debug(req.body)

  axios.get(url, {
    timeout: config.API_TIMEOUT,
  }).then(response => {
    debug('Fetch memo list from api successfully.')
    debug(response.data)
    // debug(response.text)
    // res.send(camelizeKeys(response.body))
    // const resData = JSON.parse(response.data)
    res.json(camelizeKeys(response.data))
  })
  .catch(error => {
    const errWrapped = handlerError(error)
    res.status(errWrapped.status).send({
      status: errWrapped.status,
      text: errWrapped.text
    })
    console.error(`Error occurred during fetching data from : ${url}`)
    console.error(error) 
  })

  // superagent
  // .get(url)
  // .timeout(
  //   {
  //     response: config.API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
  //     deadline: config.API_DEADLINE ? config.API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
  //   }
  // )
  // .end((error, response) => {
  //   if (!error && response) {
  //     debug('Fetch memo list from api successfully.')
  //     // debug(response.text)
  //     // res.send(camelizeKeys(response.body))
  //     const resData = JSON.parse(response.text)
  //     res.json(camelizeKeys(resData))
  //   } else {
  //     const errWrapped = handlerError(error, response)
  //     res.status(errWrapped.status).send({
  //       status: errWrapped.status,
  //       text: errWrapped.text
  //     })
  //     console.error(`Error occurred during fetching data from : ${url}`)
  //     console.error(error) 
  //   }
  // })
})

router.get('/count', (req, res) => {
  const url = `${apiHost}/memos${req.url}`
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

router.post('/create', (req, res) => {
  debug('Got a memo creating call.')
  debug(req.body)
  // res.send('ok')
  const url = `${apiHost}/memo`
  superagent
  .post(url)
  .send(req.body)
  .end((error, response) => {
    if (!error && response) {
      res.send({ status: 200, text: 'Create a new memo successfully.' })
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during create a new memo : ${url}`)
      console.error(error) 
    }
  })
})

router.put('/update', (req, res) => {
  debug('Got a memo updating call.')
  debug(req.body)
  const url = `${apiHost}/memo`
  superagent
  .put(url)
  .send(req.body)
  .end((error, response) => {
    if (!error && response) {
      res.send({ status: 200, text: 'Updating a new memo successfully.' })
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during update memo: ${url}`)
      console.error(error) 
    }
  })
})

router.delete('/', (req, res) => {
  debug('Got a memo del call.')
  debug(req.body)
  // const id = get(req, 'body.id')
  // const url = `${apiHost}/memo/${id}`
  // debug(url)
  const ids = get(req, 'body.ids', [])

  Promise.all(map(ids, id => new Promise(resolve => {
    const url = `${apiHost}/memo/${id}`
    debug('MEMBER### DELETING MEMO:', id)
    
    superagent
    .delete(url)
    .end((error, response) => {
      if (error) {
        console.error('Error occurred during deleting memo', id)
        console.error(error)     
      }
      resolve()
    })
  }).catch(error => {
    console.error('Error occurred during deleting memo', id)
    console.error(error)    
  }))).then(() => {
    res.send({ status: 200, text: 'Done.' })
  }).catch(err => {
    const errWrapped = handlerError(err)
    res.status(errWrapped.status).send({
      status: errWrapped.status,
      text: errWrapped.text
    })
    console.error(`Error occurred during deleting memo: ${ids}`)
    console.error(err)     
  })
})

module.exports = router
