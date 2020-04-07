const { get, map, last, trim } = require('lodash')
const { initBucket } = require('../gcs.js')
const { processImage } = require('../sharp.js')
const config = require('../../config')
const debug = require('debug')('README:api:assets:comm')
const fs = require('fs')

const ASSETS_GCS_PATH = config.GCS_ASSETS_PATH
const ASSETS_TYPE = config.ASSETS_TYPE
const IMAGE_SIZE = [ 'mobile@2x', 'mobile@3x', 'mobile@4x', 'tablet@1x', 'tablet@2x', 'desktop@1x', 'desktop@2x', ]
const ASSETS_SERVER_HOST = config.ASSETS_SERVER_HOST
const ASSETS_SERVER_PROTOCOL = config.ASSETS_SERVER_PROTOCOL
const ASSETS_CACHE_CONTROL = 'public, max-age=86400'

const constructFileInfo = file => {
  if (!get(file, 'filename')) { return {} }
  const asset_type = get(ASSETS_TYPE, get(get(file, 'mimetype', '').split('/'), '0').toUpperCase())
  const file_name = get(file, 'originalname', ``)
  const file_extension = last(get(file, 'originalname', '').split('.'))
  const file_type = get(file, 'mimetype', '')
  const temFileName = get(file, 'filename', `file-${Date.now().toString()}`)  

  const destination = asset_type !== ASSETS_TYPE.IMAGE
    ? asset_type !== ASSETS_TYPE.VIDEO
    ? asset_type !== ASSETS_TYPE.AUDIO
    ? null // unauthorized file type
    : `${ASSETS_GCS_PATH.AUDIO}`
    : `${ASSETS_GCS_PATH.VIDEO}`
    : `${ASSETS_GCS_PATH.IMAGE}`

  const fileBasicDestination = `${ASSETS_SERVER_PROTOCOL}://${ASSETS_SERVER_HOST}/${destination}/${temFileName}/${temFileName}`
  const fileDestinations = { basic: fileBasicDestination }
  if (asset_type === ASSETS_TYPE.IMAGE) {
    map(IMAGE_SIZE, f => {
      fileDestinations[ f ] = `${fileBasicDestination}-${f}.${file_extension}`
    })
    fileDestinations.desktop = `${fileBasicDestination}.${file_extension}`
  }    

  return {
    asset_type,
    destination,
    fileDestinations,
    file_name,
    file_extension,
    file_type,
    temFileName,
  }
}

const removeTmpFile = filePath => {
  fs.unlink(filePath, err => {
    if (err) {
      console.error(`Error: delete ${filePath} in fail.`, err)
    }
  })  
}

const bucket = initBucket(config.GCP_FILE_BUCKET)

const transferFileToStorage = async file => {
  debug('Going to transfer file to storage.', file)
  if (!get(file, 'filename')) { return Promise.resolve() }

  const fileType = get(file, 'asset_type')

  const uploadOptions = (file, filename) => ({
    destination: `${file.destination}/${file.filename}/${filename || file.filename}.${file.file_extension}`,
    metadata: { contentType: file.mimetype, cacheControl: ASSETS_CACHE_CONTROL },
    public: true
  })
  
  const uploadAssetToBucket = (file, originPath, destName) => {
    const path = originPath || file.path
    return bucket.upload(path, uploadOptions(file, destName))
      .then(data => {
        console.info(`file ${destName || file.originalname}(${path}) completed uploading to bucket.`)
        removeTmpFile(path)
        return Promise.resolve(data)
      })
      .catch(err => console.error(`Error occurred upload file to bucket, origin name: ${file.originalname} path: ${path}`, err))
  }

  switch (fileType) {
    case ASSETS_TYPE.IMAGE:
      return processImage(file)
        .then(images => {
          Promise.all(images.map(path => {
            const fileName = trim(path, 'tmp/')
            return uploadAssetToBucket(file, path, fileName)
          }))
        })
        .then(() => uploadAssetToBucket(file))
    case ASSETS_TYPE.VIDEO:
    case ASSETS_TYPE.AUDIO:
      return uploadAssetToBucket(file)
  }
}

module.exports = {
  constructFileInfo,
  transferFileToStorage
}