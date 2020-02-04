import Vue from 'vue'
import VueRouter from 'vue-router'
import CryptoDetails from '@/CryptoDetails/CryptoDetails.vue'
import RssFlows from '@/RssFlows/RssFlows.vue'
import LogIn from '@/LogIn/LogIn'
import SignUp from '@/SignUp/SignUp'
import Home from '@/Home/Home'
import Preferences from '@/Preferences/Preferences'
import store from '@/core/store'

Vue.use(VueRouter)

const authenticationGuard = (to, from, next) => {
  if (store.getters['auth/getIsLogged']) {
    next()
  } else {
    store.dispatch('app/showSnackBar', { text: 'You must be logged to access this part', type: 'warning' })
    next('/')
  }
}

const routes = [
  {
    path: '/',
    redirect: '/Home'
  },
  {
    path: '/Preferences',
    name: 'Preferences',
    component: Preferences,
    beforeEnter: authenticationGuard
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home
  },
  {
    path: '/RssFlows',
    name: 'RssFlows',
    component: RssFlows
  },
  {
    path: '/CryptoDetails/:currency',
    name: 'CryptoDetails',
    component: CryptoDetails,
    beforeEnter: authenticationGuard
  },
  {
    path: '/LogIn',
    name: 'LogIn',
    component: LogIn
  },
  {
    path: '/SignUp',
    name: 'SignUp',
    component: SignUp
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
