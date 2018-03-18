<template>
  <div class="Leaderboard">
    <router-view></router-view>
    <h1>Leaderboard</h1>

    <table class="table is-hoverable">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player Name</th>
          <th>Total Score</th>
          <th>Average Score</th>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <th>Rank</th>
          <th>Player Name</th>
          <th>Total Score</th>
          <th>Average Score</th>
        </tr>
      </tfoot>
      <tbody>
        <tr>
          <th>1</th>
          <td>Johnny</td>
          <td>5470</td>
          <td>212</td>
        </tr>
        <tr>
          <th>2</th>
          <td>Vlidamir</td>
          <td>4900</td>
          <td>175</td>
        </tr>
        <tr>
          <th>3</th>
          <td>Liu</td>
          <td>4775</td>
          <td>165</td>
        </tr>
        <tr>
          <th>4</th>
          <td>Mario</td>
          <td>1220</td>
          <td>58</td>
        </tr>
        <tr>
          <th>5</th>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>6</th>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
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
  // background-color: #303030;
  background-image: url("../assets/blankMap.png");
  background-position: top;
  background-size: cover;
  font-family: $family-mono;
  height: 900px;
  margin-bottom: -8px;
}

.table {
  margin: auto;
  background-color: #ffffff;
}

tr, td {
  font-size: 16px;
  font-family: monospace;
  // font-weight: 100;
}

h1 {
  padding: 120px 0px 40px 0px;
  font-size: 40px;
  font-family: $family-mono;
  color: $danger;
}

#app {
  text-align: center;
}
</style>
