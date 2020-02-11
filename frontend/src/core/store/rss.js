import requester from '../service/requester'
import Vue from 'vue'

const state = {
  articles: []
}

const actions = {
  fetchRssArticles: async ({ commit, rootGetters }) => {
    const baseUrl = rootGetters['app/getBaseUrl']
    const ApiUrl = baseUrl + '/articles'
    try {
      const resp = await requester.get(ApiUrl)
      commit('SET_ARTICLES', resp.data.data)
    } catch (error) {
      console.log(error.message)
    }
  }
}

const mutations = {
  SET_ARTICLES: (state, articles) => {
    Vue.set(state, 'articles', articles)
  }
}

const getters = {
  getArticles: (state) => {
    return state.articles
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
