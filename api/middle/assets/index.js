const { camelizeKeys } = require('humps')
const { find, get, map, mapKeys } = require('lodash')
const jwtService = require('../../services')
const { handlerError } = require('../../comm')
const Cookies = require('cookies')
const axios = require('axios')
const config = require('../../config')
const debug = require('debug')('README:api:project')
const express = require('express')
const fs = require('fs')
const multer  = require('multer')
const router = express.Router()
const upload = multer({ dest: 'tmp/' })

const jwtExpress = require('express-jwt')
const authVerify = jwtExpress({ secret: config.JWT_SECRET })
const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT
const decodeUriComponent = require('decode-uri-component')

const ASSETS_TYPE = {
  IMAGE: 1,
  VIDEO: 2,
  AUDIO: 3
}
const mock = [
  { asset_type: 1, destination: '/assets/images/posts/', id: 0, title: 'MOCK FOR ASSETS', copyright: 1, file_name: '1543568254-23978884ad15c7d7473f46f66fe40535.jpg' },
  { asset_type: 1, destination: '/public/', id: 1, title: 'Google 首圖', copyright: 1, file_name: 'favicon-50x50.png' },
  { asset_type: 1, destination: '/public/', id: 2, title: 'Google 首圖', copyright: 1, file_name: 'tongwenceng.jpg' },
  { asset_type: 1, destination: '/assets/images/posts/', id: 3, title: 'MOCK FOR ASSETS', copyright: 2, file_name: '1543568254-23978884ad15c7d7473f46f66fe40535.jpg' },
  { asset_type: 1, destination: '/public/', id: 4, title: 'vid', copyright: 1, file_name: 'SampleVideo_1280x720_10mb.mp4' },
  { asset_type: 1, destination: '/public/', id: 5, title: 'aud', copyright: 1, file_name: 'SampleAudio_0.7mb.mp3' },
]
router.use('/list', authVerify, (req, res) => {
  debug('Got id', req.query.id)
  debug('Got id', req.body.id)

  res.json({ _items: mock})
})

router.post('/create', authVerify, (req, res) => {
  debug('Got a asset create req.')
  debug(req.body)
  const asset_type = get(ASSETS_TYPE, get(get(req, 'body.file.mimetype', '').split('/'), '0').toUpperCase())
  debug('asset_type', asset_type)
  mock.push({
    asset_type,
    destination: '/public/',
    file_name: 'tongwenceng.jpg',
    id: mock.length,
    title: get(req, 'body.title'),
    copyright: get(req, 'body.copyright'),
  })
  res.send('Done.')
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