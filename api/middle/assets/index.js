const { constructFileInfo, transferFileToStorage } = require('./comm')
const { get, last } = require('lodash')
const { handlerError } = require('../../comm')
const Cookies = require('cookies')
const axios = require('axios')
const config = require('../../config')
const debug = require('debug')('README:api:project')
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

const mock = [
  { asset_type: 2, destination: 'http://dev.readr.tw/assets/video/e0652038fc543d31a65eecaabcdd4bec/0', file_ext: 'mp4', id: 0, title: 'TEST VID', copyright: 2, file_name: 'SampleVideo_1280x720_10mb' },
  { asset_type: 3, destination: 'http://dev.readr.tw/assets/audio/51f9c647d7670e86df56433974fd5b51/1', file_ext: 'mp3', id: 1, title: 'TEST AUD', copyright: 1, file_name: 'SampleAudio_0.7mb.mp3' },
]
router.use('/list', authVerify, (req, res) => {
  debug('Got id', req.query.id)
  debug('Got id', req.body.id)
  res.json({ _items: mock})
})

router.post('/create', authVerify, (req, res) => {
  debug('Got a asset create req.')
  debug(req.body)
  const fileInfo = constructFileInfo(get(req, 'body.file'))

  mock.push(Object.assign({}, fileInfo, {
    destination: fileInfo ? `http://dev.readr.tw${fileInfo.destination}/${fileInfo.temFileName}/${fileInfo.temFileName}` : '',
    id: mock.length,
    title: get(req, 'body.title'),
    copyright: get(req, 'body.copyright'),
  }))
  res.send('Done.')

  const file = Object.assign({}, get(req, 'body.file'), fileInfo)
  transferFileToStorage(file)
})

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
      console.error(`Error occurred during fetching data from : ${url}`)
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

module.exports = router