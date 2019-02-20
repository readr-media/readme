const { camelizeKeys } = require('humps')
const { constructFileInfo, transferFileToStorage } = require('./comm')
const { filter, get } = require('lodash')
const { handlerError } = require('../../comm')
const Cookies = require('cookies')
const config = require('../../config')
const axios = require('axios')
const debug = require('debug')('README:api:assets')
const express = require('express')
const fs = require('fs')
const jwtService = require('../../services')
const multer  = require('multer')
const router = express.Router()
const upload = multer({ dest: 'tmp/' })

const jwtExpress = require('express-jwt')
const authVerify = jwtExpress({ secret: config.JWT_SECRET })
const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT
const decodeUriComponent = require('decode-uri-component')

const checkPermission = (req, res, next) => {
  const cookies = new Cookies( req, res, {} )
  const token = cookies.get('csrf')
  jwtService.verifyToken(token, (err, decoded) => {
    if (err) {
      res.status(403).send(`Invalid token.`)
    } else {
      req.decoded = decoded
      next()
    }
  })
}

router.use('/list', checkPermission, (req, res) => {
  debug('Got a req for assets list.', req.url)

  const url = `${apiHost}/asset${req.url}`
  axios.get(url, {
    timeout: config.API_TIMEOUT,
  }).then(response => {
    debug('Fetch asset list from api successfully.')
    debug(response.data)
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
})

router.post('/create', authVerify, (req, res, next) => {
  debug('Got an asset post req.')
  const fileInfo = constructFileInfo(get(req, 'body.file'))
  const user = req.user.id
  const url = `${apiHost}/asset`

  const payload = {
    copyright: get(req, 'body.copyright'),
    title: get(req, 'body.title'),
    
    asset_type: fileInfo.asset_type,
    active: 1,
    created_by: user,
    destination: fileInfo.fileDestinations.basic,
    file_name: fileInfo.file_extension,
    file_extension: fileInfo.file_extension,
    file_name: fileInfo.file_name,
  }

  const file = Object.assign({}, get(req, 'body.file'), fileInfo)
  transferFileToStorage(file).then(() => (
    axios
    .post(url, payload)
    .then(response => {
      debug('Creating asset successfully.')
      res.send({
        message: 'Done.',
        url: fileInfo.fileDestinations
      })
      req.outcome = response
      next()
    })
    .catch(err => {
      const errWrapped = handlerError(err)
      const outcome = { status: errWrapped.status, text: errWrapped.text }
      console.error('Error occurred during insert new asset:', payload)
      console.error(err) 
      res.status(errWrapped.status).send(outcome)
      req.outcome = outcome
      next()
    })    
  )).catch(error => {
    const errWrapped = handlerError(error)
    const outcome = { status: errWrapped.status, text: errWrapped.text }
    console.error(`Error occurred during transfering file : ${file}`)
    console.error(error)     
    res.status(errWrapped.status).send(outcome)
    req.outcome = outcome
    next()
  })
})

router.put('/update', authVerify, (req, res, next) => {
  debug('Got an asset update req.')
  const fileInfo = constructFileInfo(get(req, 'body.file'))
  const user = req.user.id
  const url = `${apiHost}/asset`

  const payload = {
    copyright: get(req, 'body.copyright'),
    title: get(req, 'body.title'),
    asset_type: fileInfo.asset_type,
    active: 1,
    id: get(req, 'body.id'),
    updated_by: user,
    destination: fileInfo.fileDestinations.basic,
    file_name: fileInfo.file_extension,
    file_extension: fileInfo.file_extension,
    file_name: fileInfo.file_name,
  }

  const file = Object.assign({}, get(req, 'body.file'), fileInfo)
  transferFileToStorage(file).then(() => {
    axios
    .put(url, payload)
    .then(response => {
      debug('Updating asset successfully.')
      res.send({
        message: 'Done.',
        url: fileInfo.fileDestinations
      })
      req.outcome = response
      next()
    })
    .catch(err => {
      const errWrapped = handlerError(err)
      const outcome = { status: errWrapped.status, text: errWrapped.text }
      console.error('Error occurred during updateing an asset:', payload)
      console.error(err) 
      res.status(errWrapped.status).send(outcome)
      req.outcome = outcome
      next()
    })      
  }).catch(error => {
    const errWrapped = handlerError(error)
    const outcome = { status: errWrapped.status, text: errWrapped.text }
    console.error(`Error occurred during transfering file : ${file}`)
    console.error(error)  
    res.status(errWrapped.status).send(outcome)
    req.outcome = outcome
    next()   
  })
})

router.post('/process/:owner', checkPermission, upload.single('filepond-file'), (req, res) => {
  const type = get(req, 'params.owner')
  const file = req.file
  debug('type', type)
  debug('file.originalname', file.originalname)
  debug('file.filename', file.filename)
  res.send(file)
})
router.delete('/revert', checkPermission, (req, res, next) => {
  const path = get(req, 'body.path')
  debug('Got a revert call for:')
  debug(req.body)

  if (path) {
    fs.unlink(path, err => {
      if (err) {
        console.error(`Error: delete ${path} in fail.`, err)
        res.status(500).send(`Error: delete ${path} in fail.`)
      }
      console.info(`successfully deleted ${path}`)
      res.send('Done.')
    })
  } else {
    res.status(400).send('Bad request.')
  }
})
router.delete('/', authVerify, (req, res, next) => {
  debug('Got an asset del call.')
  debug(req.body)
  const ids = get(req, 'body.ids', [])
  axios
  .delete(`${apiHost}/asset?ids=[${ids.join(',')}]`)
  .then(response => {
    res.send({ status: 200, text: 'Done.' })
    req.outcome = response
    next()
  })
  .catch(err => {
    const errWrapped = handlerError(err)
    const outcome = { status: errWrapped.status, text: errWrapped.text }
    console.error(`Error occurred during deleting assets: ${ids}`)
    console.error(err)     
    res.status(errWrapped.status).send(outcome)
    req.outcome = outcome
    next()
  })
})


router.get('/restore', checkPermission, (req, res) => {
  debug('Got a /assets/fetch call:', asset)
  res.status(404).send('Not Found.')
})

router.get('/fetch', (req, res) => {
  const asset = get(req, 'query.a')
  debug('Got a /assets/fetch call:', asset)

  if (asset) {
    axios.get(asset, {
      timeout: config.API_TIMEOUT,
      responseType: 'arraybuffer',
    }).then(response => {
      debug('Fetch asset successfully.')
      res.writeHead(200, response.headers)
      res.end(response.data)
    })
    .catch(error => {
      const errWrapped = handlerError(error)
      res.status(errWrapped.status).send({
        status: errWrapped.status,
        text: errWrapped.text
      })
      console.error(`Error occurred during fetching data from : ${asset}`)
      console.error(error) 
    })
  } else {
    res.status(404).send('Not Found.')
  }
})

router.get('/load', (req, res) => {
  const asset = get(req, 'query.a')
  debug('Got a /assets/load call:', asset)

  if (asset) {
    res.redirect(decodeUriComponent(asset))
  } else {
    res.status(404).send('Not Found.')
  }
})

router.use('/count', (req, res) => {
  debug('Got an assets count req.')
  const url = `${apiHost}/asset/count${req.url}`
  debug('url', url)
  axios.get(url, {
    timeout: config.API_TIMEOUT,
  }).then(response => {
    debug('Get asset count from api successfully.')
    debug(response.data)
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
})

module.exports = router