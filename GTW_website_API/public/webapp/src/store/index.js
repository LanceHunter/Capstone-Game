import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';

const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGOUT = 'LOGOUT';

Vue.use(Vuex, VueAxios, axios);

export default new Vuex.Store({
  state: {
    user: {},
    isLoggedIn: !!localStorage.getItem('token'),
  },
  mutations: {
    [LOGIN](state, user) {
      state.isLoggedIn = true;
      state.user = user;
    },
    [LOGOUT](state) {
      state.isLoggedIn = false;
      state.user = {};
    },
  },
  actions: {
    login({ commit }, creds) {
      return new Promise((resolve) => {
        // replace with axios call to backend
        setTimeout(() => {
          localStorage.setItem('token', creds);
          commit(LOGIN_SUCCESS);
          resolve();
        }, 1000);
      });
    },
    logout({ commit }) {
      localStorage.removeItem('token');
      commit(LOGOUT);
    },
  },
  getters: {
    currentUser(state) {
      return state.user;
    },
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
  },
});
