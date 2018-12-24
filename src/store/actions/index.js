import {
  fetchAsideItems,
  fetchAsideNav,
  checkLoginStatus,
  fetchProfile,
  uploadImage,
} from 'src/api'
import * as actionsMember from 'src/store/actions/member'
import * as actionsList from 'src/store/actions/list'
import * as actionsItem from 'src/store/actions/item'

export default Object.assign({
  ALERT_SWITCH: ({ commit, }, { active, message, callback, }) => {
    commit('SET_ALERT_FLAG', { active, message, callback, })
  },

  CHECK_LOGIN_STATUS: ({ commit, dispatch, state }, { params }) => {
    return checkLoginStatus({ params }).then(({ status, body }) => {
      commit('SET_LOGGEDIN_STATUS', { status, body })
    })
  },

  COMMON_LIGHTBOX_SWITCH: ({ commit, }, { active, callback, component, props, }) => {
    commit('SET_COMMON_LIGHTBOX_FLAG', { active, callback, component, props })
  },

  FETCH_ASIDE_ITEMS: ({ commit, dispatch, state, }, { params, }) => {
    return fetchAsideItems().then(({ items, }) => {
      commit('SET_ASIDE_ITEMS', { items })
    })
  },

  FETCH_ASIDE_NAV: ({ commit, dispatch, state, }, { params, }) => {
    return fetchAsideNav().then(({ items, }) => {
      commit('SET_ASIDE_NAV', { items })
    })
  },

  FETCH_PROFILE: ({ commit, dispatch, state }, { params }) => {
    return fetchProfile({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_PROFILE', { profile: body })
      }
    })
  },

  SET_VALUE: ({ commit, dispatch }, { active, type, value }) => {
    return commit('SET_VALUE', { active, type, value })
  },

  UPLOAD_IMAGE: ({ commit, dispatch }, { file, type }) => {
    return uploadImage(file, type)
  },

  UPDATE_CLIENT_SIDE_MOUNTED: ({ commit, dispatch }) => {
    return commit('SET_CLIENT_SIDE_MOUNTED', {})
  },
}, actionsMember, actionsList, actionsItem)
