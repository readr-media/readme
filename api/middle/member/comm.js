const config = require('../../config')
const jwtService = require('../../services')
const jwtExpress = require('express-jwt')
const superagent = require('superagent')

const { redisFetching, } = require('../redis')

const debug = require('debug')('README:api:member:comm')
const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

const sendEmail = ({ email, content, subject, token, }) => new Promise((resolve, reject) => {
  debug({
    receiver: [ email, ],
    bcc: config.EMAIL_BCC || [],
    subject,
    content,
  })
  superagent
  .post(`${apiHost}/mail`)
  .send({
    receiver: [ email, ],
    bcc: config.EMAIL_BCC || [],
    subject,
    content,
  })
  .end((err, res) => {
    debug('Sending done.')
    const outcome = { err, res, token, }
    if (err) { reject(outcome) }
    else { resolve(outcome) }
  })
})

const sendInvitationEmail = ({ id, email, role, type, }) => {
  return new Promise(resolve => {
    const tokenForActivation = jwtService.generateActivateAccountJwt({
      id, role, type,
    })
    sendEmail({
      email,
      subject: 'READr 新聞媒體實驗邀請函',
      token: tokenForActivation,
      type: 'init',
      cb: (e, r) => resolve({ error: e, response: r, }),
      content: `<p>親愛的朋友您好，</p><br>
      <p>歡迎參與 READr 新聞媒體實驗！</p>
      <p>在資訊傳播容易且方向多元的這個網路世代，READr 希望能將單向傳播的「新聞」產製過程開放，讓新聞的產製由「Reporter」、「Engineer」、「Audience」及「Designer」一起共同完成，更期許能透過讀者的參與，讓新聞內容更加完善，也希望更透明的編輯室能讓新聞傳播有更多元的方向。</p>
      <p>我們誠摯地邀請您加入 READr，</p>
      <p>請點擊以下的連結開通您的帳號並設定密碼：</p><br>
      <a href="${config.SERVER_PROTOCOL}://${config.SERVER_HOST}${config.SERVER_PORT ? ':' + config.SERVER_PORT : ''}/api/activate/${tokenForActivation}">${config.SERVER_PROTOCOL}://${config.SERVER_HOST}${config.SERVER_PORT ? ':' + config.SERVER_PORT : ''}/api/activate/${tokenForActivation}</a><br>
      <p>期待您來與我們一同參與  READr 新聞媒體實驗。</p>
      <p>感謝。</p><br>
      <p>READr 團隊 敬上</p>
      <p>此電子郵件由系統自動發出，請勿直接回覆，謝謝您。</p>`,
    })  
  })
}


const fetchMem = (member) => new Promise((resolve, reject) => {
  superagent
  .get(`${apiHost}/member/${member.id}`)
  .end((err, res) => {
    debug('err')
    debug(err)
    if (!err) {
      resolve({ res, })      
    } else {
      reject({ err, res, })
    }
  })
})

const verifyToken = function (req, res, next) {
  const key = req.url.split('/')[1]
  redisFetching(key, ({ error, data, }) => {
    error && console.error('Error occurred during fetching token from redis.')
    error && console.error(error)
    data && debug(data)
    if (!data) {
      jwtService.verifyToken(key, (err, decoded) => {
        if (err) {
          res.status(403).send(`Invalid token.`)
        } else {
          req.decoded = decoded
          next()
        }
      })
    } else {
      res.status(403).send(`Expired token.`)      
    }
  })
}

const authVerify = jwtExpress({
  secret: config.JWT_SECRET,
  isRevoked: (req, payload, done) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' && req.headers.authorization.split(' ')[1]
    redisFetching(token, ({ error, data, }) => {
      error && console.error('Error occurred during fetching token from redis.')
      error && console.error(error)
      done(null, !!data)
    })
  },
})

module.exports = {
  authVerify,
  fetchMem,
  sendInvitationEmail,
  verifyToken,
}
