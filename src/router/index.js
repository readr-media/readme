import Vue from 'vue'
import Router from 'vue-router'
import { ReadrPerm } from '../util/services'

Vue.use(Router)
Vue.use(ReadrPerm)

// route-level code splitting
const Index = () => import('src/views/Index.vue')
const List = () => import('src/views/List.vue')
const Login = () => import('src/views/Login.vue')

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/', component: Index },
      { path: '/login', component: Login, },
      { path: '/:item/:subItem?', component: List, },
    ]
  })
}
