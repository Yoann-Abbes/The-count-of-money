import Vue from 'vue'
import requester from '../service/requester'

const state = {
  token: localStorage.getItem('token') || '',
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
  async login ({ commit, dispatch, rootGetters }, user) {
    const ApiUrl = rootGetters['app/getBaseUrl'] + '/users/login?email=' + user.email + '&password=' + user.password
    try {
      const responseLogin = await requester.get(ApiUrl)
      localStorage.setItem('token', responseLogin.headers.jwt)
      // requester.setHeader('Authorization', responseLogin.headers.jwt)
      commit('SET_TOKEN', responseLogin.headers.jwt)
      const responseGetProfile = await dispatch('getProfile')
      if (responseGetProfile.status) {
        commit('SET_IS_LOGGED', true)
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
  SET_TOKEN (state, token) {
    state.token = token
  },
  SET_USER_INFORMATION (state, resp) {
    Vue.set(state, 'user', resp)
  },
  SET_IS_LOGGED (state, resp) {
    state.isLogged = resp
  }
}

const getters = {
  getUser: (state) => {
    return state.user
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
