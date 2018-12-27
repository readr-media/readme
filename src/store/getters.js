import { get } from 'lodash'
const debug = require('debug')('CLIENT:store:getter')
export default {
  isLoginPage (state) {
    const route = get(state, 'route.path')
    return route.indexOf('login') > -1
  },
  isPreviewable (state, getters) {
    return get(getters, 'modelData.isPreviewable')
  },  
  isSubItem (state) {
    return (get(state, 'route.params.subItem')
      && get(state, 'route.params.subItem') !== 'new'
      && get(state, 'route.params.subItem') !== 'edit')
      || false
  },
  modelName (state) {
    return get(state, 'route.params.item', '').replace(/-/g, '_').toUpperCase()
  },
  modelData (state, getters) {
    debug('getters', getters)
    let model
    try {
      // model = require(`model/${get(getters, 'modelName')}`)
      model = () => import(`model/${get(getters, 'modelName')}`)
    } catch (error) {
      console.log(`There's no model found:`, get(getters, 'modelName'))
    }
    return model
  },  
  model (state, getters) {
    return get(getters, 'modelData.model')
  },
  subModel (state, getters) {
    return get(getters, 'modelData.subModel')
  },
  structure (state, getters) {
    return getters.modelData
      ? getters.isSubItem
      ? getters.subModel
      : getters.model
      : []
  }
}
