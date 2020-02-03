import requester from '../service/requester'

const state = {
  isLoading: false,
  darkMode: false,
  baseApiUrl: 'http://localhost:5005',
  appInitiated: false
}

const actions = {
  init: async ({ dispatch, commit }) => {
    if (localStorage.getItem('token') !== null) {
      requester.setHeader('Authorization', localStorage.getItem('token'))
      commit('auth/SET_IS_LOGGED', true, { root: true })
    }
    await dispatch('cryptoList/fetchCryptoList', null, { root: true })
    commit('SET_APP_INITIATED')
  }
}

const mutations = {
  SET_APP_INITIATED: (state) => {
    state.appInitiated = true
  },
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
  },
  getAppInitiated: (state) => {
    return state.appInitiated
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
