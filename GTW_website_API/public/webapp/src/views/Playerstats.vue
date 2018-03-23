<template>
  <div class='Playerstats'>
    <router-view></router-view>
    <h1>My Statistics</h1>

    <div class='message-body'>
      <!-- wins & losses -->
      <!-- <h5>Wins-Losses</h5> -->
      <svg id='chart' width='1000' height='500'></svg>
    </div>

  </div>
</template>


<script>
import stats from '../common/stats.service';

const d3 = require('d3');


function InitChart(stats) {
  // Set the dimensions of the canvas / graph
  const margin = { top: 30, right: 20, bottom: 30, left: 50 },
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Parse the date / time
  const parseDate = d3.timeParse('%B %d, %Y');

  // Set the ranges
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  // Define the line
  const statsline = d3.line()
    .x(function (d) {
      console.log('Ln 38: date on x axis: ', d.date);
      return x(d.date);
    })
    .y(function (d) {
      return y(d.score);
    });

  // Adds the svg canvas
  const svg = d3.select('#chart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  console.log('Ln 52: these are the stats: ', stats);

  stats.forEach(function (d) {
    console.log('Ln 55: this is d: ', d);
    console.log('Ln 56: date: ', d.end_time);
    d.date = new Date(d.end_time);
    console.log('Ln 58: parsed date: ', d.date);
    d.score = +d.score;
  });

  // Scale the range of the data
  x.domain(d3.extent(stats, function (d) {
    return d.date;
  }));
  y.domain([0, d3.max(stats, function (d) {
    return d.score;
  })]);

  // Nest the entries by symbol
  const statsNest = d3.nest()
    .key(function (d) {
      return d.symbol;
    })
    .entries(stats);

  // Loop through each symbol / key
  statsNest.forEach(function (d) {
    console.log('Ln 79: another d: ', d);
    console.log('Ln 80: d.values: ', d.values);
    svg.append('path')
      .attr('class', 'line')
      .attr('d', statsline(d.values));
  });

  // Add the X Axis
  svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y));
}


export default {
  name: 'Playerstats',
  data() {
    return {
      stats: null,
    };
  },
  methods: {
    getStats(username) {
      stats.user(username)
        .then((stats) => {
          this.stats = stats;
          InitChart(stats);
          console.log('set stats to:', this.stats);
        });
    },
  },
  beforeMount() {
    this.getStats(this.$route.params.username);
  },
};
</script>


<!-- Added 'scoped' attribute to limit CSS to this view only -->
<style lang='scss' scoped>
@import '../assets/main.sass';

.Playerstats {
  background-image: url('../assets/blankMap.png');
  background-position: top;
  background-size: cover;
  font-family: $family-mono;
  height: 900px;
  margin-bottom: -8px;
}

h1 {
  padding: 120px 0px 60px 0px;
  font-size: 40px;
  font-family: $family-mono;
  color: $danger;
}

h5 {
  color: black;
}

.message-body {
  width: 65%;
  height: 60%;
  margin: auto;
  background-color: darkgray;
  opacity: 0.8;
  /* background-color:rgba(0, 0, 0, 0.8); */
  border-radius: 5px;
  margin: 0px 10px 20px 0px;
  display: inline-grid;
}

body {
  font: 12px Arial;
}

path {
  stroke: steelblue;
  stroke-width: 2;
  fill: none;
}

.axis path, .axis line {
  fill: none;
  stroke: grey;
  stroke-width: 1;
  shape-rendering: crispEdges;
}

#app {
  text-align: center;
}
</style>
