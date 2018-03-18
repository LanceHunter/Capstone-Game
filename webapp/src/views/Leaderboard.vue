<template>
  <div class="Leaderboard">
    <router-view></router-view>
    <h1>Leaderboard</h1>

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
  </div>
</template>


<script>
export default {
  name: 'Leaderboard',
};
</script>


<!-- Added "scoped" attribute to limit CSS to this view only -->
<style lang="scss" scoped>
@import "../assets/main.sass";

.Leaderboard {
  background-color: #303030;
  font-family: $family-mono;
  height: 900px;
  margin-bottom: -8px;
}

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
