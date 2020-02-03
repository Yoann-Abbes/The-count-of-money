import requester from '../service/requester'

const state = {
  cryptoList: [],
  rssList: []
}

const actions = {
  async getCryptoList ({ commit, rootGetters }) {
    const ApiUrl = rootGetters['app/getBaseUrl'] + '/cryptos'
    try {
      const resp = await requester.get(ApiUrl)
      commit('SET_CRYPTOLIST', resp.data.data)
    } catch (error) {
      console.log(error)
    }
  },
  async setCrypto ({ commit, dispatch, rootGetters }, data) {
    const ApiUrl = rootGetters['app/getBaseUrl'] + '/cryptos'
    try {
      const resp = await requester.post(ApiUrl, data)
      console.log(resp)
      const resp2 = await dispatch('getCryptoList')
      console.log(resp2)
    } catch (error) {
      console.log(error)
    }
  },
  async getRSSList ({ commit, rootGetters }) {
    const ApiUrl = rootGetters['app/getBaseUrl'] + '/rss'
    try {
      const resp = await requester.get(ApiUrl)
      commit('SET_RSSLIST', resp.data.data)
    } catch (error) {
      console.log(error)
    }
  },
  async setRSS ({ commit, dispatch, rootGetters }, data) {
    const ApiUrl = rootGetters['app/getBaseUrl'] + '/rss'
    try {
      const resp = await requester.post(ApiUrl, data)
      console.log(resp)
      const resp2 = await dispatch('getRSSList')
      console.log(resp2)
    } catch (error) {
      console.log(error)
    }
  }
}

const mutations = {
  SET_CRYPTOLIST (state, resp) {
    state.cryptoList = resp
  },
  SET_RSSLIST (state, resp) {
    state.rssList = resp
  }
}

const getters = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
