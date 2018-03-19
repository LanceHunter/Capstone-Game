<template>
  <div class="Playerstats">
    <router-view></router-view>
    <h1>Player Statistics</h1>

  </div>
</template>


<script>
export default {
  name: 'Playerstats',
};
</script>


<!-- Added "scoped" attribute to limit CSS to this view only -->
<style lang="scss" scoped>
@import "../assets/main.sass";

.Playerstats {
  background-image: url("../assets/blankMap.png");
  background-position: top;
  background-size: cover;
  font-family: $family-mono;
  height: 900px;
  margin-bottom: -8px;
}


#app {
  text-align: center;
}
</style>
