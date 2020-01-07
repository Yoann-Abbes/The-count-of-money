import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false
  },
  mutations: {
    SET_LOADING: (state) => {
      state.isLoading = true
    },
    UNSET_LOADING: (state) => {
      state.isLoading = false
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    getLoading: (state) => {
      return state.isLoading
    }
  }
})
