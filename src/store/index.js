import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      user: null
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    clearUser(state) {
      state.user = null
    }
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user)
    },
    logout({ commit }) {
      commit('clearUser')
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    getUser: state => state.user
  }
})

export default store

