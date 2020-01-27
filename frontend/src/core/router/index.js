import Vue from 'vue'
import VueRouter from 'vue-router'
import CryptoDetails from '@/CryptoDetails/CryptoDetails.vue'
import RssFlows from '@/RssFlows/RssFlows.vue'
import LogIn from '../../LogIn/LogIn'
import SignUp from '../../SignUp/SignUp'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/RssFlows'
  },
  {
    path: '/RssFlows',
    name: 'RssFlows',
    component: RssFlows
  },
  {
    path: '/CryptoDetails/:currency',
    name: 'CryptoDetails',
    component: CryptoDetails
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
