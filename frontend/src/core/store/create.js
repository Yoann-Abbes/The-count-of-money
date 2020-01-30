import requester from '../service/requester'

const state = {
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
  }
}

const mutations = {
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
