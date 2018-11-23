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
  const url = `${apiHost}/poll`
  debug('Got a /poll call:')
  debug(req.url)
  res.json({
    _items: [
      {
        id: 0,
        status: 0,
        active: 1,
        title: 'poll 1',
        description: 'desc',
        image: 'https://www.google.com',
        video: 'https://www.google.com',
        total_vote: 20,
        frequency: '10',
        start_at: '2018-10-19T03:37:11Z',
        end_at: '2018-10-19T03:37:11Z',
        kind: 1,
        max_choice: 1,
        changeable: 1,
        created_by: 22,
        created_at: '2018-10-19T03:37:11Z',
      },
      {
        id: 1,
        status: 0,
        active: 1,
        title: 'poll 1',
        description: 'desc',
        image: 'https://www.google.com',
        video: 'https://www.google.com',
        total_vote: 20,
        frequency: '10',
        start_at: '2018-10-19T03:37:11Z',
        end_at: '2018-10-19T03:37:11Z',
        kind: 1,
        max_choice: 1,
        changeable: 1,
        created_by: 22,
        created_at: '2018-10-19T03:37:11Z',
      },      
    ]
  })   
  
  // superagent
  // .get(url)
  // .end((error, response) => {
  //   if (!error && response) {
  //     debug('Fetch polls from api successfully.')
  //     res.send(camelizeKeys(response.body))
  //   } else {
  //     const errWrapped = handlerError(error, response)
  //     res.status(errWrapped.status).send({
  //       status: errWrapped.status,
  //       text: errWrapped.text
  //     })
  //     console.error(`Error occurred during fetch data from : ${url}`)
  //     console.error(error) 
  //   }
  // })
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
  res.json({
    count: 99
  })
  // superagent
  // .get(url)
  // .end((error, response) => {
  //   if (!error && response) {
  //     debug('Fetch posts count from api successfully.')
  //     res.send(camelizeKeys(response.body))
  //   } else {
  //     const errWrapped = handlerError(error, response)
  //     res.status(errWrapped.status).send({
  //       status: errWrapped.status,
  //       text: errWrapped.text
  //     })
  //     console.error(`Error occurred during fetch data from : ${url}`)
  //     console.error(error) 
  //   }
  // })
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
