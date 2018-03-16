import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Leaderboard from '@/views/Leaderboard';
import Login from '@/views/Login';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: Leaderboard,
      meta: {
        requiresAuth: true,
      },
    },

  ],
});
