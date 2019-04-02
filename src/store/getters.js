import { get } from 'lodash'
export default {
  filters (state, getters) {
    return get(getters, 'modelData.filters')
  },
  isLoginPage (state) {
    const route = get(state, 'route.path', '')
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
  isSearchable (state, getters) {
    return get(getters, 'modelData.isSearchable', false)
  },
  modelName (state) {
    return get(state, 'route.params.item', '').replace(/-/g, '_').toUpperCase()
  },
  modelData (state, getters) {
    return get(state, 'modelData')
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
