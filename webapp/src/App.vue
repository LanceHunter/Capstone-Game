<template>
  <div id="app">
    <theheader></theheader>
    <router-view></router-view>
  </div>
</template>

<script>
import theheader from '@/components/Header';

export default {
  name: 'App',
  components: {
    theheader,
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
