<template>
  <div class='Playerstats'>
    <router-view></router-view>
    <h1>Player Statistics</h1>

    <div class='message-body circle'>
      <!-- wins / total games -->
      <h5>Win/Loss Percentages</h5>
      <!-- <svg id='circlechart' width='500' height='250'></svg> -->
      <div id='circlechart' width='500' height='250'></div>
    </div>

    <div class='message-body line'>
      <!-- wins & losses -->
      <h5>Wins-Losses</h5>
      <svg id='linechart' width='500' height='250'></svg>
    </div>

    <div class='message-body bar'>
      <!-- Score, hit points, shots, R&D  versus Averages for all players-->
      <h5>Offensive Strategy</h5>
      <svg id='barchart' width='500' height='250'></svg>
    </div>

    <!-- <line-chart :data='{'2017-05-13': 2, '2017-05-14': 5}'></line-chart> -->

  </div>
</template>


<script>
const d3 = require('d3');

// Circle Chart
function InitCircleChart() {
  const dataset = [{
    label: 'Wins',
    'test-score': 90,
  },
  // {
  //   label: 'Losses',
  //   'test-score': 75,
  // },
  ];

  const width = 205;
  const height = 205;
  const innerRadius = 185;

  const drawArc = d3.arc()
    .innerRadius(innerRadius / 2)
    .outerRadius(width / 2)
    .startAngle(0);

  const vis = d3.select('#circlechart').selectAll('svg')
    .data(dataset)
    .enter()
    .append('svg')
    .attr('class', 'svgCircle')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')'); // eslint-disable-line

  vis.append('circle')
    .attr('fill', '#ffffff')
    .attr('stroke', '#dfe5e6')
    .attr('stroke-width', 1)
    .attr('r', width / 2);

  d3.selectAll('.svgCircle')
    .append('text')
    .text(function sa(d) { // eslint-disable-line
      return d.label;
    })
    .style('stroke', 'black')
    .attr('dy', '1em');

  vis.append('path')
    .attr('fill', 'blueviolet')
    .attr('class', 'arc')
    .each(function ae(d) { // eslint-disable-line
      d.endAngle = 0;
    })
    .attr('d', drawArc)
    .transition()
    .duration(1200)
    .ease(d3.easeLinear)
    .call(arcTween);


  vis.append('text')
    .text(0)
    .attr('class', 'perc')
    .attr('text-anchor', 'middle')
    .attr('font-size', '36px')
    .attr('y', +10)
    .transition()
    .duration(1200)
    .tween('.percentage', function tw(d) {
      const i = d3.interpolate(this.textContent, d['test-score']),
        prec = (d.value + '').split('.'),
        round = (prec.length > 1) ? 10 ** prec[1].length : 1;
      return function rf(t) {
        this.textContent = Math.round(i(t) * round) / round + '%'; // eslint-disable-line
      };
    });

  function arcTween(transition) {
    transition.attrTween('d', function ta(d) {
      // .curve(d3.curveBasis);
      const interpolate = d3.interpolate(0, 360 * (d['test-score'] / 100) * Math.PI / 180);
      // let interpolate = d3.curve(0, 360 * (d['test-score'] / 100) * Math.PI / 180);
      return function (t) {
        d.endAngle = interpolate(t);
        return drawArc(d);
      };
    });
  }
}


// Line Chart Graph
function InitLineChart() {
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

    xAxis = d3.axisBottom()
      .scale(xScale),

    yAxis = d3.axisLeft()
      .scale(yScale);

  vis.append('svg:g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')') // eslint-disable-line
    // .attr('stroke', 'white')
    .call(xAxis);

  vis.append('svg:g')
    .attr('class', 'y axis')
    .attr('transform',
          'translate(' + (MARGINS.left) + ',0)') // eslint-disable-line
    // .attr('stroke', 'white')
    .call(yAxis);

  const lineGen = d3.line()
    .x(function lgx(d) { // eslint-disable-line
      return xScale(d.year); // eslint-disable-line
    })
    .y(function lgy(d) { // eslint-disable-line
      return yScale(d.sale); // eslint-disable-line
    })
    .curve(d3.curveBasis);

  vis.append('svg:path')
    .attr('d', lineGen(data))
    .attr('stroke', 'orange')
    .attr('stroke-width', 2)
    .attr('fill', 'none');

  vis.append('svg:path')
    .attr('d', lineGen(data2))
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
}

$(document).ready(function char() { // eslint-disable-line
  InitCircleChart(); // eslint-disable-line
});

$(document).ready(function char() { // eslint-disable-line
  InitLineChart(); // eslint-disable-line
});

// $(document).ready(function char() {
//   InitBarChart();
// });


export default {
  name: 'Playerstats',
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
  /* font-size: 30px;
  color: $primary;
  margin-bottom: 50px; */
  padding: 120px 0px 40px 0px;
  font-size: 40px;
  font-family: $family-mono;
  color: $danger;
}

h5 {
  color: black;
}

.message-body {
  width: 35%;
  margin: auto;
  background-color: darkgray;
  opacity: 0.8;
  // background-color:rgba(0, 0, 0, 0.8);
  /* border: 1px solid black; */
  border-radius: 5px;
  margin: 0px 10px 20px 0px;
  display: inline-grid;
}

.message-body.circle {
  height: 266px;
}

/* circle graph */
.circleLabel {
  z-index:999;
  background-color:red;
  float: left;
  display: block;
  height: 30px;
  width: 100px;
  clear: left;
  margin: 0 15px 15px 0;
}


/* path.domain, line {
  stroke: white;
} */

#app {
  text-align: center;
}
</style>
