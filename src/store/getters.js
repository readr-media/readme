import { get } from 'lodash'
const debug = require('debug')('CLIENT:store:getter')
export default {
  isLoginPage (state) {
    const route = get(state, 'route.path')
    return route.indexOf('login') > -1
  }
}
