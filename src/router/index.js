import Vue from 'vue'
import Router from 'vue-router'
import { ReadrPerm } from '../util/services'

Vue.use(Router)
Vue.use(ReadrPerm)

// route-level code splitting
const Index = () => import('src/views/Index.vue')
const List = () => import('src/views/List.vue')
const Login = () => import('src/views/Login.vue')
const PageNotFound = () => import('src/views/PageNotFound.vue')
const SetUp = () => import('src/views/SetUp.vue')
const SystemError = () => import('src/views/SystemError.vue')

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/', component: Index, meta: { permission: 'admin', }, },
      { path: '/login', component: Login, },
      { path: '/setup/:type?', component: SetUp, meta: { permission: 'admin', }, },
      { path: '/list/:item/:subItem?/:action?', component: List, meta: { permission: 'admin', }, },
      { path: '/404', component: PageNotFound },
      { path: '/500', component: SystemError }
    ]
  })
}
