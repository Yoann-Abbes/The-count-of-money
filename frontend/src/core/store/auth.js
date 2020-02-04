import Vue from 'vue'
import requester from '../service/requester'

const state = {
  isLogged: false,
  user: {
    email: '',
    username: '',
    picture_url: '',
    keyword: [],
    favorites_crypto: []
  }
}

const actions = {
  async updateUserInfos ({ commit, rootGetters }, values) {
    const ApiUrl = rootGetters['app/getBaseUrl'] + '/users/profile'

    try {
      await requester.put(ApiUrl, {
        username: values.newUsername,
        keyword: values.newKeywords,
        favorites_crypto: values.newFavorites
      })
      commit('SET_USER_INFORMATION', {
        email: state.user.email,
        username: values.newUsername,
        picture_url: state.user.picture_url,
        keyword: values.newKeywords,
        favorites_crypto: values.newFavorites
      })
      return { status: true, message: 'OK' }
    } catch (error) {
      return { status: false, message: error.message }
    }
  },
  async logout ({ commit }) {
    commit('RESET_USER')
    commit('SET_IS_LOGGED', false)
    localStorage.removeItem('token')
  },
  async create ({ dispatch, rootGetters }, user) {
    const ApiUrl = rootGetters['app/getBaseUrl'] + '/users/register'
    try {
      const responseCreate = await requester.post(ApiUrl, user)
      console.log(responseCreate)
      return { status: true, message: 'OK' }
    } catch (error) {
      return { status: false, message: error.message }
    }
  },
  async login ({ commit, dispatch, rootGetters }, user) {
    const ApiUrl = rootGetters['app/getBaseUrl'] + '/users/login?email=' + user.email + '&password=' + user.password
    try {
      const responseLogin = await requester.get(ApiUrl)
      localStorage.setItem('token', responseLogin.headers.jwt)
      requester.setHeader('Authorization', responseLogin.headers.jwt)
      const responseGetProfile = await dispatch('getProfile')
      if (responseGetProfile.status) {
        commit('SET_IS_LOGGED', true)
        dispatch('app/showSnackBar', { text: `Welcome back ${responseGetProfile.message.username} !`, type: 'success' }, { root: true })
        return { status: true, message: 'login and profile loading complete' }
      } else {
        commit('SET_IS_LOGGED', false)
        return { status: false, message: 'profile loading error' }
      }
    } catch (error) {
      localStorage.removeItem('token')
      return { state: true, message: error.response }
    }
  },
  async getProfile ({ commit, rootGetters }) {
    const ApiUrl = rootGetters['app/getBaseUrl'] + '/users/profile'
    try {
      const response = await requester.get(ApiUrl)
      commit('SET_USER_INFORMATION', response.data)
      return { status: true, message: response.data }
    } catch (error) {
      localStorage.removeItem('token')
      return { status: false, message: error.response }
    }
  }
}

const mutations = {
  RESET_USER (state) {
    const user = {
      email: '',
      username: '',
      picture_url: '',
      keyword: [],
      favorites_crypto: []
    }
    Vue.set(state, 'user', user)
  },
  SET_USER_INFORMATION (state, userValue) {
    Vue.set(state, 'user', userValue)
  },
  SET_IS_LOGGED (state, value) {
    state.isLogged = value
  }
}

const getters = {
  getKeywords: (state) => {
    return state.user.keyword
  },
  getFavouriteCrypto: (state) => {
    return state.user.favorites_crypto
  },
  getUser: (state) => {
    return state.user
  },
  getUsername: (state) => {
    return state.user.username
  },
  getUserPicture: (state) => {
    return state.user.picture_url
  },
  getUserEmail: (state) => {
    return state.user.email
  },
  getIsLogged: (state) => {
    return state.isLogged
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
