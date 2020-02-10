import requester from '../service/requester'

const state = {
  cryptoList: [],
  rssList: []
}

const actions = {
  async deleteCrypto ({ dispatch, rootGetters }, symbol) {
    const ApiUrl = rootGetters['app/getBaseUrl'] + `/cryptos/${symbol}`
    try {
      await requester.delete(ApiUrl)
      await dispatch('getCryptoList')
      return true
    } catch (error) {
      return false
    }
  },
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
      await requester.post(ApiUrl, data)
      await dispatch('getCryptoList')
      return true
    } catch (error) {
      return false
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
  async deleteRSS ({ dispatch, rootGetters }, id) {
    const ApiUrl = rootGetters['app/getBaseUrl'] + `/rss/${id}`
    try {
      await requester.delete(ApiUrl)
      await dispatch('getRSSList')
      return true
    } catch (error) {
      return false
    }
  },
  async setRSS ({ dispatch, rootGetters }, data) {
    const ApiUrl = rootGetters['app/getBaseUrl'] + '/rss'
    try {
      await requester.post(ApiUrl, data)
      await dispatch('getRSSList')
      return true
    } catch (error) {
      return false
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
  getCryptoList (state) {
    return state.cryptoList
  },
  getRssList (state) {
    return state.rssList
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
