const { GCP_KEYFILE, GCP_PROJECT_ID } = require('../config')
const {Storage} = require('@google-cloud/storage')

// const debug = require('debug')('README:api:middle:gcs')

const initBucket = (bucket) => {
  const storage = new Storage({
    projectId: GCP_PROJECT_ID,
    keyFilename: GCP_KEYFILE,
  })
	return storage.bucket(bucket);
}

const uploadFileToBucket = (bucket, filePath, options = {}) => {
  return bucket.upload(filePath, options)
}

module.exports = {
  initBucket,
  uploadFileToBucket
}