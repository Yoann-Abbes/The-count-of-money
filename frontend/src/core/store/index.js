import Vue from 'vue'
import Vuex from 'vuex'

import app from './app'
import auth from './auth'
import cryptoList from './cryptoList'
import cryptoHistory from './cryptoHistory'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    auth,
    cryptoHistory,
    cryptoList
  },
  strict: debug
})
