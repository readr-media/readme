import moment from 'moment'
import numeral from 'numeral'
const STATIC_ASSETS_HOST = 'www.readr.tw'

// const debug = require('debug')('CLIENT:comm')

export function getDatetime (dateStr, format = 'YYYY/MM/DD HH:mm:ss') {
  return dateStr && moment(new Date(dateStr)).format(format)
}

export function getHost () {
  const browser = typeof window !== 'undefined'
  if (browser) {
    return `//${location.host}`
  } else {
    const host = process.env.HOST || 'localhost'
    const port = parseInt(process.env.PORT) || 8080
    return `${host}:${port}`
  }
}

export function getFullUrl (url) {
  const browser = typeof window !== 'undefined'
  let hostname
  if (browser) {
    hostname = location.hostname
  }
  if (hostname === 'localhost') {
    return `http://${STATIC_ASSETS_HOST}${url}`
  }
  return url
}

export function isDescendant (child, { parentClassname = 'none', parant }) {
  let node = child.parentNode 
  while (node !== null && node !== undefined) {
    if ((node.className && node.className.indexOf(parentClassname) > -1) || node === parant) {
      return true
    }
    node = node.parentNode
  }
  return false
}

export function calcFileSize (bytes) {
  return numeral(bytes).format('0 b')
}
