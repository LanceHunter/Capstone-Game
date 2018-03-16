import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Login from '@/views/Login';
import Leaderboard from '@/views/Leaderboard';

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
      name: 'Login',
      component: Login,
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      component: Leaderboard,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});
