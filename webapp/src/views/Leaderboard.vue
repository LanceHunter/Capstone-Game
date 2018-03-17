<template>
  <div>
    <h1>Leaderboard</h1>
    <router-view></router-view>
  </div>

  <!-- <table>
    <tr>
      <th>Rank</th>
      <th>User</th>
      <th>High Score</th>
      <th>Average Score</th>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </table> -->
</template>


<script>
export default {
  name: 'Leaderboard',
};
</script>


<!-- Added "scoped" attribute to limit CSS to this view only -->
<style lang="scss" scoped>
@import "../assets/main.sass";

h1 {
  font-size: 30px;
  font-family: $family-mono;
  // background-color: $background;
  color: $danger;
}

#app {
  text-align: center;
  // color: #2c3e50;
}
</style>
