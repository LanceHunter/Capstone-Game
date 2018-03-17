<template>
  <div>
    <h1>Login</h1>
    <router-view></router-view>
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

h1 {
  // background-color: $background;
  font-size: 30px;
  font-family: $family-mono;
  color: $danger;
}

#app {
  text-align: center;
  // color: #2c3e50;
}
</style>
