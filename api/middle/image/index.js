const { camelizeKeys } = require('humps')
const { find, trim } = require('lodash')
const { handlerError } = require('../../comm')
const { initBucket, makeFilePublic, uploadFileToBucket, deleteFileFromBucket, publishAction } = require('../gcs.js')
const { processImage } = require('./sharp.js')
const config = require('../../config')
const debug = require('debug')('README:api:image')
const express = require('express')
const fs = require('fs')
const multer  = require('multer')
const path = require('path')
const router = express.Router()
const superagent = require('superagent')
const upload = multer({ dest: 'tmp/' })

const jwtExpress = require('express-jwt')
const authVerify = jwtExpress({ secret: config.JWT_SECRET })
const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.post('/:sourceType', upload.single('image'), (req, res) => {
  
  const url = `${apiHost}${req.url}`
  const bucket = initBucket(config.GCP_FILE_BUCKET)
  const file = req.file
  const destination = req.params.sourceType === 'member' ? `${config.GCS_IMG_MEMBER_PATH}/${file.originalname}` : config.GCS_IMG_POST_PATH
  
  processImage(file, req.params.sourceType)
    .then((images) => {
      const origImg = req.params.sourceType === 'member' ? trim(images[images.length - 1], 'tmp/') : trim(images[0], 'tmp/')
      Promise.all(images.map((path) => {
        const fileName = trim(path, 'tmp/')
        return uploadFileToBucket(bucket, path, {
          destination: `${destination}/${fileName}`,
          metadata: {
            contentType: file.mimetype
          }
        }).then((bucketFile) => {
          console.info(`file ${fileName}(${path}) completed uploading to bucket `)
          fs.unlink(path, (err) => {
            if (err) {
              console.error(`Error: delete ${path} fail`)
            }
            console.info(`successfully deleted ${path}`)
          })
          makeFilePublic(bucketFile)
        })
      }))
      .then(() => {
        res.status(200).send({url: `${destination}/${origImg}`,})
      })
    })
    .catch((err) => {
      res.status(500).send(err)
      console.error(`Error occurred during fetch data from : ${url}`)
      console.error(err)
    })
})

module.exports = router
