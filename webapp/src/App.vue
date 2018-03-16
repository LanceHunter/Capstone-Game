<template>
  <div id="app">
    <thenavbar></thenavbar>
    <router-view/>
  </div>
</template>


<script>
import TheNavbar from '@/components/TheNavbar'

export default {
  name: 'App',
  components: {
    TheNavbar,
  }
};
</script>


<!-- Added "scoped" attribute to limit CSS to this view only -->
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
