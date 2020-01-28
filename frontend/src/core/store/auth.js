import requester from '../service/requester'

const state = {
  token: localStorage.getItem('token') || '',
  baseApiUrl: 'http://localhost:5005',
  waitingForConnection: false,
  email: '',
  username: '',
  picture_url: '',
  keyword: [],
  favorites_crypto: []
}

const actions = {

  login ({ commit }, user) {
    const ApiUrl = state.baseApiUrl + '/users/login?email=' + user.email + '&password=' + user.password
    return new Promise((resolve, reject) => {
      requester.get(ApiUrl)
        .then(resp => {
          commit('loginSuccess', resp)
          resolve(resp)
        })
        .catch(err => {
          commit('loginFail', err.response)
          reject(err.response)
        })
    })
  },
  getProfile ({ commit }) {
    const ApiUrl = state.baseApiUrl + '/users/profile'
    return new Promise((resolve, reject) => {
      requester.get(ApiUrl)
        .then(resp => {
          commit('profileSuccess', resp)
          resolve(resp)
        })
        .catch(err => {
          reject(err.response)
        })
    })
  }
}

const mutations = {
  loginSuccess (state, resp) {
    if (resp.data === 'OK' && resp.status === 200) {
      localStorage.setItem('token', resp.headers.JWT)
      requester.setHeader('Authorization', resp.headers.JWT)
      state.waitingForConnection = true
    } else {
      state.waitingForConnection = false
      localStorage.removeItem('token')
    }
  },
  loginFail (state, resp) {
    state.waitingForConnection = false
    if (resp.data.error === 'Bad credentials' && resp.status === 400) {
      localStorage.removeItem('token')
    }
  },
  profileSuccess (state, resp) {
    state.email = resp.data.email
    state.username = resp.data.username
    state.picture_url = resp.data.picture_url
    state.keyword = resp.data.keyword
    state.favorites_crypto = resp.data.favorites_crypto
  }
}

const getters = {
  getUsername: (state) => {
    return state.username
  },
  getEmail: (state) => {
    return state.email
  },
  getUrlPicture: (state) => {
    return state.picture_url
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
