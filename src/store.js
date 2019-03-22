import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    users: {
      loggedUser: null,
      allUsers: null
    },
    groups: [],
    disciplines: [],
    tests: {
      available: null,
      completed: null
    }
  },
  getters: {
    loggedUser: state => {
      return state.users.loggedUser
    },
    allUsers: state => {
      return state.users.allUsers
    },
    groups: state => {
      return state.groups
    },
    disciplines: state => {
      return state.disciplines
    },
    tests: state => {
      return state.tests
    }
  },
  mutations: {

  },
  actions: {

  }
})
