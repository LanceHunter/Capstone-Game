<template>
  <div class="Playerstats">
    <router-view></router-view>
    <h1>Player Statistics</h1>

    <div class="message-body">
      <div class="container">
        <svg id="linechart" width="500" height="250"></svg>
      </div>
    </div>

    <!-- <line-chart :data="{'2017-05-13': 2, '2017-05-14': 5}"></line-chart> -->

  </div>
</template>


<script>
const d3 = require('d3');

function InitChart() {
  const data = [{
    sale: '202',
    year: '2000',
  }, {
    sale: '215',
    year: '2002',
  }, {
    sale: '179',
    year: '2004',
  }, {
    sale: '199',
    year: '2006',
  }, {
    sale: '134',
    year: '2008',
  }, {
    sale: '176',
    year: '2010',
  }];

  const data2 = [{
    sale: '152',
    year: '2000',
  }, {
    sale: '189',
    year: '2002',
  }, {
    sale: '179',
    year: '2004',
  }, {
    sale: '199',
    year: '2006',
  }, {
    sale: '134',
    year: '2008',
  }, {
    sale: '176',
    year: '2010',
  }];

  const vis = d3.select('#linechart').append('svg'), // eslint-disable-line
    WIDTH = 500,
    HEIGHT = 250,
    MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50,
    },

    xScale = d3.scaleLinear()
      .range([MARGINS.left, WIDTH - MARGINS.right])
      .domain([2000, 2010]),

    yScale = d3.scaleLinear()
      .range([HEIGHT - MARGINS.top, MARGINS.bottom])
      .domain([134, 215]),

    xAxis = d3.axisLeft()
      .scale(xScale),

    yAxis = d3.axisBottom()
      .scale(yScale);
      // .orient('left');

  vis.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')') // eslint-disable-line
    .call(xAxis);

  vis.append('g')
    .attr('class', 'y axis')
    .attr('transform',
          'translate(' + (MARGINS.left) + ',0)') // eslint-disable-line
    .call(yAxis);

  const lineGen = d3.line()
    .x(function lgx(d) {
      return xScale(d.year);
    })
    .y(function lgy(d) {
      return yScale(d.sale);
    })
    // .interpolate('basis');
    .curve(d3.curveBasis);

  vis.append('svg:path')
    .attr('d', lineGen(data))
    .attr('stroke', 'green')
    .attr('stroke-width', 2)
    .attr('fill', 'none');

  vis.append('svg:path')
    .attr('d', lineGen(data2))
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
}

$(document).ready(function char() {
  InitChart();
});

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
  padding-top: 100px;
}

h1 {
  font-size: 30px;
  color: $primary;
  margin-bottom: 50px;
}

.message-body {
  background-color: white;
}

.axis path {
  fill: none;
  stroke: #777;
  shape-rendering: crispEdges;
}

.axis text {
  font-family: Lato;
  font-size: 13px;
}

#app {
  text-align: center;
}
</style>
