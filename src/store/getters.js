import { get } from 'lodash'
const debug = require('debug')('CLIENT:store:getter')
export default {
  isLoginPage (state) {
    const route = get(state, 'route.path')
    return route.indexOf('login') > -1
  },
  model (state) {
    return get(state, 'route.params.item', '').replace(/-/g, '_').toUpperCase()
  },
  modelData (state, getters) {
    debug('getters', getters)
    let model
    try {
      model = require(`model/${get(getters, 'model')}`)
    } catch (error) {
      console.log(`There's no model found:`, get(getters, 'model'))
    }
    return model
  },  
}
