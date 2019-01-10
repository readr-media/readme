const Cookies = require('cookies')
const LRU = require('lru-cache')
const compression = require('compression')
const express = require('express')
const favicon = require('serve-favicon')
const fs = require('fs')
const microcache = require('route-cache')
const path = require('path')
const requestIp = require('request-ip')
const resolve = file => path.resolve(__dirname, file)
const uuidv4 = require('uuid/v4')
const config = require('./api/config')
const { createBundleRenderer } = require('vue-server-renderer')
const { filter, get } = require('lodash')

const debug = require('debug')('README:server')
const isProd = process.env.NODE_ENV === 'production'
const useMicroCache = process.env.MICRO_CACHE !== 'false'
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const app = express()

function createRenderer (bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, Object.assign(options, {
    // for component caching
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    // this is only needed when vue-server-renderer is npm-linked
    basedir: resolve('./dist'),
    // recommended for performance
    runInNewContext: false
  }))
}

app.use(requestIp.mw())
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')

let renderer
let readyPromise
const templatePath = resolve('./src/index.template.html')
if (isProd) {
  // In production: create server renderer using template and built server bundle.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const template = fs.readFileSync(templatePath, 'utf-8')
  const bundle = require('./dist/vue-ssr-server-bundle.json')
  // The client manifests are optional, but it allows the renderer
  // to automatically infer preload/prefetch links and directly add <script>
  // tags for any async chunks used during render, avoiding waterfall requests.
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  readyPromise = require('./build/setup-dev-server')(
    app,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options)
    }
  )
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

app.use(compression({ threshold: 0 }))
app.use(favicon('./public/favicon-50x50.png'))
app.use('/dist', serve(path.join(__dirname, './dist'), true))
app.use('/public', serve(path.join(__dirname, './public'), true))
app.use('/manifest.json', serve(path.join(__dirname, './manifest.json'), true))
app.use('/service-worker.js', serve(path.join(__dirname, './dist/service-worker.js')))

// since this app has no user-specific content, every page is micro-cacheable.
// if your app involves user-specific content, you need to implement custom
// logic to determine whether a request is cacheable based on its url and
// headers.
// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
// app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))

function render (req, res, next) {
  debug('req.url', req.url)
  if (req.url.indexOf('/api/') === 0) {
    next()
    return
  } else if (req.url.indexOf('/404') === 0) {
    res.status(404).send('404 | Page Not Found')
    return
  }

  const s = Date.now()

  const curr_host = get(req, 'headers.host') || ''
  const targ_exp = /(dev)|(localhost)/
  debug('Current client host:', curr_host, !curr_host.match(targ_exp))
  debug('req.headers', req.headers)

  if (filter(config.PAGE_CACHE_EXCLUDING, (p) => (req.url.indexOf(p) > -1)).length === 0) {
    // !curr_host.match(targ_exp) && res.setHeader('Cache-Control', 'public, max-age=3600')  
  }
  res.setHeader("Content-Type", "text/html")
  res.setHeader("Server", serverInfo)

  const cookies = new Cookies( req, res, {} )
  const readrid = cookies.get('readrid')
  if (!readrid) {
    cookies.set('readrid', uuidv4(), { httpOnly: false, expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) })
  }

  const handleError = err => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')  
    if (err.url) {
      return res.redirect(err.url)
    } else if(err.code === 404) {
      return res.status(404).send('404 | Page Not Found')
    } else if (err.code === 403) {
      if (cookies.get('csrf')) {
        return res.status(403).send('You dont have any permission at this moment. Please ask admin for futher permission that you desire.')
      } else {
        return res.redirect(302, '/login')
      }
    } else {
      // Render Error Page or Redirect
      console.error(`error during render : ${req.url}`)
      console.error(err.stack)
      return res.status(500).send('500 | Internal Server Error')
    }
  }


  let context = {
    title: 'ReadMe',
    ogTitle: 'Readr',
    description: 'Readr',
    metaUrl: 'cms.readr.tw',
    metaImage: '/public/og.png',
    url: req.url,
    cookie: cookies.get('csrf'),
    initmember: cookies.get('initmember'),
    includ_fbsdk: '',
    include_gapi: '',
    include_recaptcha: '',
    setting: { 
      POST_ACTIVE: config.POST_ACTIVE, 
      POST_TYPE: config.POST_TYPE, 
      PROJECT_STATUS: config.PROJECT_STATUS, 
      TAG_ACTIVE: config.TAG_ACTIVE, 
      GOOGLE_RECAPTCHA_SITE_KEY: config.GOOGLE_RECAPTCHA_SITE_KEY,
      // DOMAIN: config.DOMAIN,
      DOMAIN: get(curr_host.split(':'), 0),
    } 
  }
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.send(html)
    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  })
}

app.get('*', (req, res, next) => {
  req.domain = get(req.host.split(':'), 0)
  next()
}, isProd ? render : (req, res, next) => {
  readyPromise.then(() => render(req, res, next))
})

app.use('/api', (req, res, next) => {
  req.domain = get(req.host.split(':'), 0)
  console.log('req.domain', req.domain)
  next()
}, require('./api/index'))

const port = process.env.PORT || 8081
const server = app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
module.exports = {
  close: () => {
    server.close()
  },
  ready: readyPromise,
  app: server
}
