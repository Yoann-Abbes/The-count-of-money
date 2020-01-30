import requester from '../service/requester'

const state = {
  isLoading: false,
  darkMode: false,
  baseApiUrl: 'http://localhost:5005'
}

const actions = {
  init () {
    if (localStorage.getItem('token') != null) {
      requester.setHeader('Authorization', localStorage.getItem('token'))
    }
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
  },
  getBaseUrl: (state) => {
    return state.baseApiUrl
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
