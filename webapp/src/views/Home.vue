<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>HOME PAGE</h2>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      msg: 'HOME PAGE',
    };
  },
};
</script>

<!-- Added "scoped" attribute to limit CSS to this view only -->
<style lang="scss" scoped>
@import "../assets/main.sass";

* {
  background-color: $background;
  font-family: $family-mono;
}

h1, h2 {
  font-weight: normal;
  background-color: $background;
  color: $danger;
}
#app {
  text-align: center;
  color: #2c3e50;
}
</style>
