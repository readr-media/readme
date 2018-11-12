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
  SET_ALERT_FLAG: (state, { active, message, callback, }) => {
    state[ 'alertFlag' ][ 'active' ] = active
    state[ 'alertFlag' ][ 'message' ] = message
    state[ 'alertFlag' ][ 'callback' ] = callback
  },
  SET_LOGGEDIN_STATUS: (state, { status, body }) => {
    state['isLoggedIn'] = body
  },
  SET_PROFILE: (state, { profile }) => {
    state['profile'] = profile
  },
}, mutationsMember, mutationsList, mutationsItem)
