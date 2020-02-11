import requester from '../service/requester'
import Vue from 'vue'

const state = {
  minute: {},
  hourly: {},
  daily: {}
}

const actions = {
  fetchAllPeriodHistory: async ({ dispatch }, currency) => {
    await dispatch('fetchPeriodHistory', { currency, period: 'minute' })
    await dispatch('fetchPeriodHistory', { currency, period: 'hourly' })
    await dispatch('fetchPeriodHistory', { currency, period: 'daily' })
  },
  fetchPeriodHistory: async ({ commit, rootGetters }, { currency, period }) => {
    const baseUrl = rootGetters['app/getBaseUrl']
    const ApiUrl = `${baseUrl}/cryptos/${currency}/history/${period}`
    try {
      const resp = await requester.get(ApiUrl)
      commit('SET_CRYPTO_PERIOD', { cryptoHistory: resp.data.data, currency, period })
    } catch (error) {
      console.log(error.message)
    }
  }
}

const mutations = {
  SET_CRYPTO_PERIOD: (state, { cryptoHistory, period, currency }) => {
    const statePeriod = JSON.parse(JSON.stringify(state[period]))
    statePeriod[currency] = cryptoHistory
    Vue.set(state, period, statePeriod)
  }
}

const getters = {
  historyAvailable: (state) => ({ period, currency }) => {
    return state[period][currency] !== undefined
  },
  getFormatedPeriodHistory: (state) => ({ currency, period }) => {
    return state[period] && state[period][currency] && state[period][currency].map(p => ({
      x: Date.parse(p.timestamp),
      y: [p.open, p.high, p.low, p.close]
    }))
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
