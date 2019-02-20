const CONFIG = require('../../config')
const debug = require('debug')('CLIENT:README:api:middle:gcLogger:comm')
const { get } = require('lodash')

// const { Logging } = require('@google-cloud/logging')
const Logging = require('@google-cloud/logging')
// const loggingClient = new Logging({
const loggingClient = Logging({
  projectId: CONFIG.GCP_PROJECT_ID,
  keyFilename: CONFIG.GCP_KEYFILE,
})

const trace = data => {
  const log = loggingClient.log(CONFIG.GCP_STACKDRIVER_LOG_NAME)
  const metadata = { resource: { type: 'global', }, }
  const entry = log.entry(metadata, data)
  return log
    .write(entry)
    .then(() => debug('Logging successfully.'))
    .catch(err => console.error('Client info logging error occurred:', err))
}

const tracer = (req, res) => {
  const exp = /^\/([A-Za-z0-9_\-]*)\b[A-Za-z0-9.*+?^=!:${}()#%~&_@\-`|\[\]\/\\]*/
  const model = get(req.url_origin.match(exp), '1')
  const response = { status: get(req, 'outcome.status'), text: get(req, 'outcome.text') }
  trace({
    ip: req.clientIp,
    method: req.method,
    model,
    payload: req.payload,
    operator: req.user.id,
    response,
  })
}

module.exports = {
  trace,
  tracer,
}