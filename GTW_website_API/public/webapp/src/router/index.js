import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Login from '@/views/Login';
import LaunchGame from '@/views/LaunchGame';
import Leaderboard from '@/views/Leaderboard';
import Playerstats from '@/views/Playerstats';
import CreateAccount from '@/views/CreateAccount';


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
      path: '/login/new',
      name: 'CreateAccount',
      component: CreateAccount,
    },
    {
      path: '/launchgame',
      name: 'LaunchGame',
      component: LaunchGame,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      component: Leaderboard,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/stats/:username',
      name: 'Playerstats',
      component: Playerstats,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});
