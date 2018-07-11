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
      projects: [],
      projectsCount: 0,
      memos: [],
      memosCount: 0,
      list: [],
      listCurrent: '',
      isLoggedIn: false,
      peopleList: [],
      profile: {},
      reports: [],
      reportsCount: 0,
    },
    actions,
    mutations,
    getters
  })
}
