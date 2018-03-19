<template>
  <div class="Leaderboard">
    <router-view></router-view>
    <h1>Leaderboard</h1>

    <table class="table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player Name</th>
          <th>Total Score</th>
          <th>Average Score</th>
          <th>Win Percentage</th>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <th>Rank</th>
          <th>Player Name</th>
          <th>Total Score</th>
          <th>Average Score</th>
          <th>Win Percentage</th>
        </tr>
      </tfoot>
      <tbody>
        <tr>
          <th>1</th>
          <td>Johnny</td>
          <td>5470</td>
          <td>212</td>
          <td>91%</td>
        </tr>
        <tr>
          <th>2</th>
          <td>Vlidamir</td>
          <td>4900</td>
          <td>175</td>
          <td>85%</td>
        </tr>
        <tr>
          <th>3</th>
          <td>Liu</td>
          <td>4775</td>
          <td>165</td>
          <td>83%</td>
        </tr>
        <tr>
          <th>4</th>
          <td>Mario</td>
          <td>1220</td>
          <td>58</td>
          <td>37%</td>
        </tr>
        <tr>
          <th>5</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>6</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>


    <!-- <div class="message-body"> -->
      <div class="clock">

        <div class="digit hours">
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
        </div>

        <div class="digit hours">
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
        </div>

        <div class="separator"></div>
        <div class="digit minutes">
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
        </div>

        <div class="digit minutes">
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
        </div>

        <div class="separator"></div>
        <div class="digit seconds">
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
        </div>

        <div class="digit seconds">
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment"></div>
        </div>

      </div>
    <!-- </div> -->

  </div>
</template>


<script>
// clock
const digitSegments = [
  [1, 2, 3, 4, 5, 6],
  [2, 3],
  [1, 2, 7, 5, 4],
  [1, 2, 7, 3, 4],
  [6, 7, 2, 3],
  [1, 6, 7, 3, 4],
  [1, 6, 5, 4, 3, 7],
  [1, 2, 3],
  [1, 2, 3, 4, 5, 6, 7],
  [1, 2, 7, 3, 6],
];

document.addEventListener('DOMContentLoaded', function clock() { // eslint-disable-line
  const _hours = document.querySelectorAll('.hours'); // eslint-disable-line
  const _minutes = document.querySelectorAll('.minutes'); // eslint-disable-line
  const _seconds = document.querySelectorAll('.seconds'); // eslint-disable-line

  setInterval(function clockTime() { // eslint-disable-line
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    setNumber(_hours[0], Math.floor(hours / 10), 1); // eslint-disable-line
    setNumber(_hours[1], hours % 10, 1); // eslint-disable-line

    setNumber(_minutes[0], Math.floor(minutes / 10), 1); // eslint-disable-line
    setNumber(_minutes[1], minutes % 10, 1); // eslint-disable-line

    setNumber(_seconds[0], Math.floor(seconds / 10), 1); // eslint-disable-line
    setNumber(_seconds[1], seconds % 10, 1); // eslint-disable-line
  }, 1000);
});

const setNumber = function clockNumber(digit, number, on) { // eslint-disable-line
  const segments = digit.querySelectorAll('.segment');
  const current = parseInt(digit.getAttribute('data-value')); // eslint-disable-line

  // only switch if number has changed or wasn't set
  if (!isNaN(current) && current !== number) { // eslint-disable-line
    // unset previous number
    digitSegments[current].forEach(function digits(digitSegment, index) { // eslint-disable-line
      setTimeout(function digitSeg() { // eslint-disable-line
        segments[digitSegment - 1].classList.remove('on');
      }, index * 45);
    });
  }

  if (isNaN(current) || current !== number) {
    // set new number after
    setTimeout(function nextDig() { // eslint-disable-line
      digitSegments[number].forEach(function nextDigSeg(digitSegment, index) { // eslint-disable-line
        setTimeout(function nds() { // eslint-disable-line
          segments[digitSegment - 1].classList.add('on');
        }, index * 45);
      });
    }, 250);
    digit.setAttribute('data-value', number);
  }
};


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
  // background-color: #ffffff;
  border-radius: 5px;
  background-color:rgba(0, 0, 0, 0.8);
  color: white;
  border: 1px solid white;
}

tr, td {
  font-size: 16px;
  font-family: monospace;
  // font-weight: 100;
}

.table thead th, .table tfoot th, .table th, .table td {
  text-align: center;
  color: white;
}

.table th:is-active, .table td:is-active {
  color: black;
}

h1 {
  padding: 120px 0px 40px 0px;
  font-size: 40px;
  font-family: $family-mono;
  color: $danger;
}

.clock {
  height: 100px;
  // position: absolute;
  top: 80%;
  left: 50%;
  // width: 100%;
  margin-left: -450px;
  // margin-top: 300px;
  padding-top: 150px;
  text-align: center;
  margin: auto;
}

.digit {
  width: 60px;
  height: 100px;
  margin: 0 5px;
  position: relative;
  display: inline-block;
}

.digit .segment {
  // background: #c00;
  background: $danger;
  border-radius: 5px;
  position: absolute;
  opacity: 0.15;
  transition: opacity 0.2s;
}

.digit .segment.on, .separator {
  opacity: 1;
  box-shadow: 0 0 50px rgba(255,0,0,0.6);
  transition: opacity 0s;
}

.separator {
  width: 10px;
  height: 10px;
  // background: #c00;
  background: $danger;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  top: -45px;
}

.digit .segment:nth-child(1) {
  top: 5px;
  left: 10px;
  right: 10px;
  height: 5px;
}

.digit .segment:nth-child(2) {
  top: 10px;
  right: 5px;
  width: 5px;
  height: 37.5px;
  height: calc(50% - 12.5px);
}

.digit .segment:nth-child(3) {
  bottom: 10px;
  right: 5px;
  width: 5px;
  height: 37.5px;
  height: calc(50% - 12.5px);
}

.digit .segment:nth-child(4) {
  bottom: 5px;
  right: 10px;
  height: 5px;
  left: 10px;
}

.digit .segment:nth-child(5) {
  bottom: 10px;
  left: 5px;
  width: 5px;
  height: 37.5px;
  height: calc(50% - 12.5px);
}

.digit .segment:nth-child(6) {
  top: 10px;
  left: 5px;
  width: 5px;
  height: 37.5px;
  height: calc(50% - 12.5px);
}

.digit .segment:nth-child(7) {
  bottom: 47.5px;
  bottom: calc(50% - 5px);
  right: 10px;
  left: 10px;
  height: 5px;
}

#app {
  text-align: center;
}
</style>
