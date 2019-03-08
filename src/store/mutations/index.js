import * as mutationsMember from 'src/store/mutations/member'
import * as mutationsList from 'src/store/mutations/list'
import * as mutationsItem from 'src/store/mutations/item'

export default Object.assign({
  SET_ASIDE_ITEMS: (state, { items }) => {
    state[ 'asideItems' ] = items
  },
  SET_ASIDE_NAV: (state, { items }) => {
    state[ 'asideNav' ] = items
  },
  SET_ALERT_FLAG: (state, { active, message, callback, hint }) => {
    state[ 'alertFlag' ][ 'active' ] = active
    state[ 'alertFlag' ][ 'message' ] = message
    state[ 'alertFlag' ][ 'callback' ] = callback
    state[ 'alertFlag' ][ 'hint' ] = hint
  },
  SET_AVALIBLE_MODELS: (state, { models, }) => {
    state[ 'availableModels' ] = models
  },
  SET_CLIENT_SIDE_MOUNTED: (state, {}) => {
    state['isClientSideMounted'] = true
  },
  SET_COMMON_LIGHTBOX_FLAG: (state, { active, callback, component, custProps, }) => {
    state[ 'commonLightboxFlag' ][ 'active' ] = active
    state[ 'commonLightboxFlag' ][ 'callback' ] = callback
    state[ 'commonLightboxFlag' ][ 'component' ] = component
    state[ 'commonLightboxFlag' ][ 'custProps' ] = custProps
  },
  SET_MODEL_DATA: (state, { modelData }) => {
    state['modelData'] = modelData
  },
  SET_LOGGEDIN_STATUS: (state, { status, body }) => {
    state['isLoggedIn'] = body
  },
  SET_PROFILE: (state, { profile }) => {
    state['profile'] = profile
  },
}, mutationsMember, mutationsList, mutationsItem)
