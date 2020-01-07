import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false,
    darkMode: false
  },
  mutations: {
    SET_DARKMODE: (state) => {
      state.darkMode = true
    },
    UNSET_DARKMODE: (state) => {
      state.darkMode = false
    },
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
    },
    getDarkMode: (state) => {
      return state.darkMode
    }
  }
})
