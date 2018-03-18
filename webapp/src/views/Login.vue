<template>
  <div>
    <h1>Login</h1>
    <router-view/>
  </div>
</template>

<script>
import auth from '../common/auth.service';

console.log('was logged in:', auth.isLoggedIn());

if (!auth.isLoggedIn()) {
  auth.login('test0', 'password');
} else {
  auth.logout();
}

console.log('now logged in:', auth.isLoggedIn());

export default {
  name: 'Login',
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
