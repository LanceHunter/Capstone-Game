<template>
  <div>
    <h1>Login</h1>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Login',
};
</script>

<!-- Added "scoped" attribute to limit CSS to this view only -->
<style lang="scss" scoped>
@import "../assets/main.sass";

#app {
  text-align: center;
  color: #2c3e50;
}
</style>
