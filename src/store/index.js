import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      alertFlag: {
        message: '',
        active: false,
      },
      asideItems: [],
      asideNav: [],
      list: [],
      listCurrent: '',
      listItemsCount: 0,
      isLoggedIn: false,
      profile: {},
      'register-token': '',
      systemVersion: '1.0.0',
      valueSetter: {
        active: false,
        type: '',
        value: '',
      },
    },
    actions,
    mutations,
    getters
  })
}
