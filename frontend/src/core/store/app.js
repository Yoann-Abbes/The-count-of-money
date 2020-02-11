import requester from '../service/requester'

const state = {
  isLoading: false,
  darkMode: false,
  baseApiUrl: 'http://localhost:5005',
  appInitiated: false,
  snackBarDisplayed: false,
  snackBarText: '',
  defaultTimeout: 3000,
  snackBarType: ''
}

const actions = {
  init: async ({ dispatch, commit }) => {
    const token = localStorage.getItem('token')
    if (token !== null) {
      requester.setHeader('Authorization', token)
      const getProfile = await dispatch('auth/getProfile', null, { root: true })
      if (getProfile.status) {
        commit('auth/SET_IS_LOGGED', true, { root: true })
        dispatch('showSnackBar', { text: `Welcome back ${getProfile.message.username} !`, type: 'success' })
      } else {
        commit('auth/SET_IS_LOGGED', false, { root: true })
      }
    }
    const darkMode = localStorage.getItem('darkMode')
    if (darkMode !== null) {
      commit(`${darkMode ? '' : 'UN'}SET_DARKMODE`)
    }
    await dispatch('cryptoList/fetchCryptoList', null, { root: true })
    commit('SET_APP_INITIATED')
  },
  showSnackBar: ({ commit, getters }, { text, time, type }) => {
    if (type !== 'warning' && type !== 'success') return
    const timeout = time || getters['getDefaultTimeout']
    commit('SET_SNACKBAR_TYPE', type)
    commit('SET_SNACKBAR_TEXT', text)
    commit('DISPLAY_SNACKBAR')
    setTimeout(() => {
      commit('HIDE_SNACKBAR')
    }, timeout)
  }
}

const mutations = {
  SET_SNACKBAR_TYPE: (state, value) => {
    state.snackBarType = value
  },
  SET_SNACKBAR_TEXT: (state, value) => {
    state.snackBarText = value
  },
  HIDE_SNACKBAR: (state) => {
    state.snackBarDisplayed = false
  },
  DISPLAY_SNACKBAR: (state) => {
    state.snackBarDisplayed = true
  },
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
  getSnackBarType: (state) => {
    return state.snackBarType
  },
  getSnackBarDisplayed: (state) => {
    return state.snackBarDisplayed
  },
  getSnackBarText: (state) => {
    return state.snackBarText
  },
  getDefaultTimeout: (state) => {
    return state.defaultTimeout
  },
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
