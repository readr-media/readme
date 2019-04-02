import { get, find, map } from 'lodash'
import {
  fetchAsideItems,
  fetchAsideNav,
  fetchAvalibleModels,
  checkLoginStatus,
  fetchProfile,
} from 'src/api'
import * as actionsMember from 'src/store/actions/member'
import * as actionsList from 'src/store/actions/list'
import * as actionsItem from 'src/store/actions/item'

let models

export default Object.assign({
  ALERT_SWITCH: ({ commit, }, { active, message, textCancel, textConfirm, hint, callback, confirmHandler, cancelHandler, type }) => {
    commit('SET_ALERT_FLAG', { active, message, hint, textCancel, textConfirm, callback, confirmHandler, cancelHandler, type })
  },

  CHECK_LOGIN_STATUS: ({ commit, dispatch, state }, { params }) => {
    return checkLoginStatus({ params }).then(({ status, body }) => {
      commit('SET_LOGGEDIN_STATUS', { status, body })
    })
  },

  COMMON_LIGHTBOX_SWITCH: ({ commit, }, { active, callback, component, custProps, }) => {
    commit('SET_COMMON_LIGHTBOX_FLAG', { active, callback, component, custProps })
  },

  UPDATE_EDITOR_MUTATION_STATE: ({ commit, }, { status, handler }) => {
    commit('SET_EDITOR_MUTATION_STATE', { status, handler })
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

  FETCH_AVAILABLE_MODELS: ({ commit, dispatch, state, getters }) => {
    return fetchAvalibleModels({}).then(({ body }) => {
      return commit('SET_AVALIBLE_MODELS', { models: body || [] })
    })
  },

  FETCH_MODEL_DATA: ({ commit, dispatch, state, getters }) => {
    /**
     * ToDo: should check permission to decide to load the model.
     */
    models = models || map(get(state, 'availableModels', []), m => ({
      name: m,
      modelFetcher: process.env.NODE_ENV === 'production'
        ? () => import(`model/${m}`)
        : () => Promise.resolve(require(`model/${m}`))
    }))    
    const fetchModel = get(find(models, { name: get(getters, 'modelName', '') }), 'modelFetcher')
    return fetchModel ? fetchModel().then(m => commit('SET_MODEL_DATA', { modelData: m })) : Promise.resolve()
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

  UPDATE_CLIENT_SIDE_MOUNTED: ({ commit, dispatch }) => {
    return commit('SET_CLIENT_SIDE_MOUNTED', {})
  },
}, actionsMember, actionsList, actionsItem)
