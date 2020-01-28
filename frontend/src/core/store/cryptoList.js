import requester from '../service/requester'
import Vue from 'vue'

const state = {
  cryptos: []
}

const actions = {
  fetchCryptoList: async ({ commit, rootGetters }) => {
    const baseUrl = rootGetters['app/getBaseUrl']
    const ApiUrl = baseUrl + '/cryptos'
    try {
      const resp = await requester.get(ApiUrl)
      commit('SET_CRYPTOS', resp.data.data)
    } catch (error) {
      console.log(error.message)
    }
  }
}

const mutations = {
  SET_CRYPTOS: (state, cryptos) => {
    Vue.set(state, 'cryptos', cryptos)
  }
}

const getters = {
  getCryptoBySymbol: (state) => (currency) => {
    return state.cryptos.find(c => c.symbol === currency)
  },
  getCryptos: (state) => {
    return state.cryptos
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
