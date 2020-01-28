import requester from "../service/requester";

const state = {
  isLoading: false,
  darkMode: false
}

const actions = {
  init () {
    requester.setHeader('Authorization', localStorage.getItem('token') || '')
  }
}

const mutations = {
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
}

const getters = {
  getLoading: (state) => {
    return state.isLoading
  },
  getDarkMode: (state) => {
    return state.darkMode
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
