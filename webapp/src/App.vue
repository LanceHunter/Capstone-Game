<template>
  <div id="app">
    <the-navbar></the-navbar>
    <router-view></router-view>
  </div>
</template>


<script>
import TheNavbar from '@/components/TheNavbar';

export default {
  name: 'App',
  components: {
    TheNavbar,
  },
};
</script>


<!-- Added "scoped" attribute to limit CSS to this view only -->
<style lang="scss" scoped>
#app {
  text-align: center;
  color: #2c3e50;
}
</style>
