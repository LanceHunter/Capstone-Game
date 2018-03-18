<template>
  <div>
    <h1>Login</h1>
    <button type="button" v-on:click="loginToggle">Login toggle</button>
    <router-view/>
  </div>
</template>

<script>
import auth from '../common/auth.service';

export default {
  name: 'Login',
  methods: {
    loginToggle() {
      console.log('was logged in:', auth.isLoggedIn());
      if (!auth.isLoggedIn()) {
        auth.login('test0', 'password')
          .then(() => {
            console.log('now logged in:', auth.isLoggedIn());
          });
      } else {
        auth.logout();
        console.log('now logged in:', auth.isLoggedIn());
      }
    },
  },
};

</script>

<!-- Added "scoped" attribute to limit CSS to this view only -->
<style lang="scss" scoped>
@import "../assets/main.sass";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
