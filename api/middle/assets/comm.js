const { get, map, last } = require('lodash')
const { initBucket, makeFilePublic, uploadFileToBucket, deleteFileFromBucket, publishAction } = require('../gcs.js')
const config = require('../../config')
const debug = require('debug')('README:api:assets:comm')
const fs = require('fs')

const ASSETS_GCS_PATH = {
  IMAGE: '/assets/images',
  VIDEO: '/assets/video',
  AUDIO: '/assets/audio',
}
const ASSETS_TYPE = {
  IMAGE: 1,
  VIDEO: 2,
  AUDIO: 3
}
const IMAGE_SIZE = [ 'desktop', 'mobile', 'tablet', 'tiny' ]

const constructFileInfo = file => {
  if (!get(file, 'filename')) { return {} }
  const asset_type = get(ASSETS_TYPE, get(get(file, 'mimetype', '').split('/'), '0').toUpperCase())
  const file_name = get(file, 'originalname', ``)
  const file_ext = last(get(file, 'originalname', '').split('.'))
  const file_type = get(file, 'mimetype', '')
  const temFileName = get(file, 'filename', `file-${Date.now().toString()}`)  

  const destination = asset_type !== ASSETS_TYPE.IMAGE
    ? asset_type !== ASSETS_TYPE.VIDEO
    ? asset_type !== ASSETS_TYPE.AUDIO
    ? null // unauthorized file type
    : `${ASSETS_GCS_PATH.AUDIO}`
    : `${ASSETS_GCS_PATH.VIDEO}`
    : `${ASSETS_GCS_PATH.IMAGE}`

  const fileBasicDestination = `http://www.readr.tw${destination}/${temFileName}/${temFileName}`
  const fileDestinations = { basic: fileBasicDestination }
  if (asset_type === ASSETS_TYPE.IMAGE) {
    map(IMAGE_SIZE, f => {
      fileDestinations[ f ] = `${fileBasicDestination}.${file_ext}`
    })
  }    

  return {
    asset_type,
    destination,
    fileDestinations,
    file_name,
    file_ext,
    file_type,
    temFileName,
  }
}

const bucket = initBucket(config.GCP_FILE_BUCKET)
const transferFileToStorage = async file => {
  debug('Going to transfer file to storage.', file)
  if (!get(file, 'filename')) { return Promise.resolve() }
  return uploadFileToBucket(bucket, file.path, {
    destination: `${file.destination}/${file.filename}/${file.filename}.${file.file_ext}`,
    metadata: { contentType: file.mimetype }
  }).then(bucketFile => {
    console.info(`file ${file.originalname}(${file.path}) completed uploading to bucket `)
    fs.unlink(file.path, err => {
      if (err) {
        console.error(`Error: delete ${file.path} in fail.`, err)
      }
      console.info(`successfully deleted ${file.path}`)
    })
    makeFilePublic(bucketFile)
  })
}

module.exports = {
  constructFileInfo,
  transferFileToStorage
}