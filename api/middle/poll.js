const { camelizeKeys } = require('humps')
const { handlerError } = require('../comm')
const { get, map, remove } = require('lodash')
const config = require('../config')
const debug = require('debug')('README:api:poll')
const express = require('express')
const numeral = require('numeral')
const router = express.Router()
const superagent = require('superagent')

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT
const postOpts = (url, opts) => new Promise(resolve => {
  superagent
  .post(url)
  .send({
    choices: opts
  })
  .end((error) => {
    if (error) {
      console.error(`Error occurred during gen options: ${url}`)
      console.error(error) 
    }
    resolve()
  })  
})
const putOpts = (url, opts) => new Promise(resolve => {
  superagent
  .put(url)
  .send({
    choices: opts
  })
  .end((error) => {
    if (error) {
      console.error(`Error occurred during put options: ${url}`)
      console.error(error) 
    }
    resolve()
  })  
})
const updateOptions = (req, res) => {
  const options = get(req, 'body.options', [])
  const id = get(req, 'body.id')
  
  if (!id) {
    console.error('Missing poll id. Opts len:', options.length)
    res.send({ status: 200, text: 'Creating/Updating a poll successfully but options got problems.' })
  } else {

    const url = `${apiHost}/v2/polls/${id}/choices`
  
    map(options, (opt, index) => {
      opt.created_by = req.user.id
      opt.updated_by = req.user.id
      opt.active = 1
      opt.group_order = index
    })

    const oldOpts = remove(options, opt => opt.id)
  
    /**
     * 	ID         int64             `json:"id" db:"id"`
     * Choice     models.NullString `json:"choice" db:"choice"`
     * TotalVote  models.NullInt    `json:"total_vote" db:"total_vote"`
     * PollID     models.NullInt    `json:"poll_id" db:"poll_id"`
     * Active     models.NullInt    `json:"active" db:"active"`
     * GroupOrder models.NullInt    `json:"group_order" db:"group_order"`
     * CreatedAt  models.NullTime   `json:"created_at" db:"created_at"`
     * CreatedBy  models.NullInt    `json:"created_by" db:"created_by"`
     * UpdatedAt  models.NullTime   `json:"updated_at" db:"updated_at"`
     * UpdatedBy  models.NullInt    `json:"updated_by" db:"updated_by"`
     */

    debug('oldOpts:')
    debug(oldOpts)
    
    Promise.all([
      postOpts(url, options),
      putOpts(url, oldOpts)
    ]).then(() => {
      res.send({ status: 200, text: 'Creating/Updating a poll successfully.' })
    }).catch(err => {
      const errWrapped = handlerError(err)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during updating options of poll.id ${id}`)
      console.error(err)     
    })
  }
}

router.use('/list', (req, res) => {
  const url = `${apiHost}/v2/polls`
  debug('Got a /polls call:')
  debug(req.url)
  
  superagent
  .get(url)
  .end((error, response) => {
    if (!error && response) {
      debug('Fetch polls from api successfully.')
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
router.use(`/:id/choices`, (req, res) => {
  const id = req.params.id
  const url = `${apiHost}/v2/polls/${id}/choices`
  debug('Got a /polls/${id}/choices call:')
  debug(req.url)
  
  superagent
  .get(url)
  .end((error, response) => {
    if (!error && response) {
      debug('Fetch polls from api successfully.')
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
  const url = `${apiHost}/v2/polls`
  // const options = get(req, 'body.options', [])
  req.body.created_by = req.user.id
  req.body.updated_by = req.user.id

  superagent
  .post(url)
  .send(req.body)
  .end((error, response) => {
    if (!error && response) {
      debug('response:')
      debug(response.text)
      // if (options.length) {
      //   next()
      // } else {
        res.send({ status: 200, text: 'Create a new poll successfully.' })
      // }
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during create a new poll : ${url}`)
      console.error(error) 
    }
  })
})

router.put('/update', (req, res, next) => {  
  const url = `${apiHost}/v2/polls`
  debug('Got a poll updating call.')
  debug('req.body', req.body)

  const options = get(req, 'body.options', [])
  superagent
  .put(url)
  .send(req.body)
  .end((error, response) => {
    if (!error && response) {
      if (options.length) {
        debug('options.length', options.length)
        next()
      } else {
        res.send({ status: 200, text: 'Updating a poll successfully.' })
      }      
    } else {
      const errWrapped = handlerError(error, response)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during updating poll: ${url}`)
      console.error(error) 
    }
  })
}, updateOptions)

router.get('/count', (req, res) => {
  const url = `${apiHost}/v2/polls`
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
    const url = `${apiHost}/v2/polls/${id}`
    debug('POLL### DELETING poll:', id)

    superagent
    .delete(url)
    .end((error, response) => {
      if (error) {
        console.error('Error occurred during deleting poll', id)
        console.error(error)     
      }
      resolve()
    })    
  }).catch(error => {
    console.error('Error occurred during deleting poll', id)
    console.error(error)    
  }))).then(() => {
    res.send({ status: 200, text: 'Done.' })
  }).catch(err => {
    const errWrapped = handlerError(err)
    res.status(errWrapped.status).send({
      status: errWrapped.status,
      text: errWrapped.text
    })
    console.error(`Error occurred during deleting poll: ${ids}`)
    console.error(err)     
  })
})
module.exports = router
