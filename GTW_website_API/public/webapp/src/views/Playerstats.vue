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


function drawPlayerChart(stats) {
  // Set the dimensions of the canvas / graph
  const margin = {top: 30, right: 20, bottom: 70, left: 50},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // Parse the date / time
  const parseDate = d3.timeParse('%B %b, %Y');

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
      return y(d.price);
    });

  // Adds the svg canvas
  const svg = d3.select('#chart')
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')');

  console.log('Ln 54: these are the stats: ', stats);

  // Get the data
  // d3.csv('stats.csv', function(error, data) {
    stats.forEach(function (d) {
      console.log('Ln 59: this is d: ', d);
      console.log('Ln 60: date: ', d.end_time);
  		d.date = new Date(d.end_time);
      console.log('Ln 62: parsed date: ', d.date);
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
    const dataNest = d3.nest()
      .key(function(d) {
        return d.symbol;
      })
      .entries(stats);

    // set the color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // spacing for the legend
    const legendSpace = width/dataNest.length;

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) {
      console.log('Ln 89: another d: ', d);
      console.log('Ln 90: d.values: ', d.values);
      svg.append('path')
        .attr('class', 'line')
        .style('stroke', function() { // Add the colors dynamically
          return d.color = color(d.key); })
        // .attr('id', 'tag'+d.key.replace(/\s+/g, '')) // assign ID
        .attr('d', statsline(d.values));

      // Add the Legend
      svg.append('text')
        .attr('x', (legendSpace/2)+i*legendSpace)  // space legend
        .attr('y', height + (margin.bottom/2)+ 5)
        .attr('class', 'legend')    // style the legend
        .style('fill', function fl() { // Add the colours dynamically
          return d.color = color(d.key); })
        .on('click', function cl(){
          // Determine if current line is visible
          var active   = d.active ? false : true,
          newOpacity = active ? 0 : 1;
          // Hide or show the elements based on the ID
          d3.select('#tag'+d.key.replace(/\s+/g, ''))
            .transition().duration(100)
            .style('opacity', newOpacity);
          // Update whether or not the elements are active
          d.active = active;
          })
        .text(d.key);
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
  // });
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
          drawPlayerChart(stats);
          console.log('set stats to:', this.stats);
        });
    },
  },
  beforeMount() {
    this.getStats(this.$route.params.username);
  },

  // beforeMount() {
  //   $(document).ready(function drawPChart() {
  //     drawPlayerChart();
  //   });
  // },
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
  /* background-color: darkgray; */
  background-color: white;
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

.legend {
  font-size: 16px;
  font-weight: bold;
  text-anchor: middle;
}

#app {
  text-align: center;
}
</style>
