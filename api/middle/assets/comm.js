const { get, map, last, trim } = require('lodash')
const { initBucket, makeFilePublic, uploadFileToBucket, deleteFileFromBucket, publishAction } = require('../gcs.js')
const { processImage } = require('../sharp.js')
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
const IMAGE_SIZE = [ 'desktop', 'mobile@2x', 'mobile@3x', 'mobile@4x', 'tablet@1x', 'tablet@2x', 'desktop@1x', 'desktop@2x', ]

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

  const fileBasicDestination = `${config.SERVER_PROTOCOL}://${config.SERVER_HOST}${destination}/${temFileName}/${temFileName}`
  const fileDestinations = { basic: fileBasicDestination }
  if (asset_type === ASSETS_TYPE.IMAGE) {
    map(IMAGE_SIZE, f => {
      fileDestinations[ f ] = `${fileBasicDestination}-${f}.${file_ext}`
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

const removeTmpFile = file => {
  fs.unlink(file.path, err => {
    if (err) {
      console.error(`Error: delete ${file.path} in fail.`, err)
    }
    console.info(`successfully deleted ${file.path}`)
  })  
}
const bucket = initBucket(config.GCP_FILE_BUCKET)
const transferFileToStorage = async file => {
  debug('Going to transfer file to storage.', file)
  if (!get(file, 'filename')) { return Promise.resolve() }

  const fileType = get(file, 'asset_type')
  switch (fileType) {
    case ASSETS_TYPE.IMAGE:
      processImage(file).then(images => {
        Promise.all(images.map(path => {
          const fileName = trim(path, 'tmp/')
          return uploadFileToBucket(bucket, path, {
            destination: `${file.destination}/${file.filename}/${fileName}.${file.file_ext}`,
            metadata: { contentType: file.mimetype }
          }).then(bucketFile => {
            console.info(`file ${fileName}(${path}) completed uploading to bucket `)
            removeTmpFile({ path })
            makeFilePublic(bucketFile)
          })
        }))
      }).catch(err => {
        console.error(`Error occurred process file: ${file.originalname}`)
        console.error(err)
      })
      // Then, dont break, and go next to upload main file.
    case ASSETS_TYPE.VIDEO:
    case ASSETS_TYPE.AUDIO:
      return uploadFileToBucket(bucket, file.path, {
        destination: `${file.destination}/${file.filename}/${file.filename}.${file.file_ext}`,
        metadata: { contentType: file.mimetype }
      }).then(bucketFile => {
        console.info(`file ${file.originalname}(${file.path}) completed uploading to bucket `)
        removeTmpFile(file)
        makeFilePublic(bucketFile)
      })
  }
}

module.exports = {
  constructFileInfo,
  transferFileToStorage
}