<template>
  <div id="app">
    <the-navbar></the-navbar>
    <router-view></router-view>
  </div>
</template>


<script>
import auth from './common/auth.service';
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
  background-color: #303030;
  height: 100%;
  margin: -8px;
}
</style>
