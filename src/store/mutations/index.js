import { get } from 'lodash'
import * as mutationsMember from 'src/store/mutations/member'
import * as mutationsList from 'src/store/mutations/list'

const debug = require('debug')('CLIENT:mutations')

export default Object.assign({
  SET_ASIDE_ITEMS: (state, { items }) => {
    state[ 'asideItems' ] = items
  },
  SET_ALERT_FLAG: (state, { active, message, callback, }) => {
    state[ 'alertFlag' ][ 'active' ] = active
    state[ 'alertFlag' ][ 'message' ] = message
    state[ 'alertFlag' ][ 'callback' ] = callback
  },




  SET_LOGGEDIN_STATUS: (state, { status, body }) => {
    state['isLoggedIn'] = body
  },
  SET_PEOPLE_LIST: (state, { people }) => {
    state['peopleList'] = people
  },
  SET_PROFILE: (state, { profile }) => {
    state['profile'] = profile
  },
  SET_PROJECTS: (state, { projects }) => {
    state.projects = get(projects, 'body.items', [])
  },
  SET_PROJECTS_COUNT: (state, { count }) => {
    state.projectsCount = count
  },
  SET_REPORTS: (state, { reports }) => {
    state.reports = get(reports, 'body.items', [])
  },
  SET_REPORTS_COUNT: (state, { count }) => {
    state.reportsCount = count
  },
  SET_MEMOS: (state, { memos }) => {
    state.memos = get(memos, 'body.items', [])
  },
  SET_MEMOS_COUNT: (state, { count }) => {
    state.memosCount = count
  },
  REMOVE_MEMOS: (state, ids) => {
    state['memos'] = state['memos'].filter(memo => !ids.includes(memo.id))
  }
}, mutationsMember, mutationsList)
