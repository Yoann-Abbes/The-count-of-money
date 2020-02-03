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
  SET_USER_INFORMATION (state, userValue) {
    Vue.set(state, 'user', userValue)
  },
  SET_IS_LOGGED (state, value) {
    console.log('islogged', value)

    state.isLogged = value
  }
}

const getters = {
  getUser: (state) => {
    return state.user
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
