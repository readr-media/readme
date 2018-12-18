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
const decodeUriComponent = require('decode-uri-component')

router.use('/list', authVerify, (req, res) => {
  debug('Got id', req.query.id)
  debug('Got id', req.body.id)

  res.json({ _items: [
    { asset_type: 1, url: 'http://www.readr.tw/assets/images/posts/1543568254-23978884ad15c7d7473f46f66fe40535.jpg', id: 0, title: 'Google 首圖', copyright: 1, },
    { asset_type: 1, url: '/public/favicon-50x50.png', id: 0, title: 'Google 首圖', copyright: 1, },
    { asset_type: 1, url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', id: 2, title: 'Google 圖', copyright: 2, },
  ]})
})

router.get('/fetch', (req, res) => {
  const asset = get(req, 'query.a')
  debug('Got a /assets/fetch call:', asset)

  if (asset) {
    res.redirect(decodeUriComponent(asset))
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