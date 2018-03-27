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
  const margin = { top: 30, right: 20, bottom: 70, left: 50 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // Parse the date / time
  // const parseDate = d3.timeParse('%B %b, %Y');

  // Set the ranges
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  // Define the line
  // score
  let statsline = d3.line()
    .x((d) => {
      console.log('Ln 39: date on x axis: ', d.date);
      return x(d.date);
    })
    .y((d) => {
      console.log('Ln 43: score on y axis: ', d.score);
      return y(d.score);
    });

  // hit points
  let statslinehp = d3.line()
    .x((d) => {
      console.log('Ln 50: date on x axis: ', d.date);
      return x(d.date);
    })
    .y((d) => {
      console.log('Ln 54: hit points on y axis: ', d.hit_points);
      return y(d.hit_points);
    });

  // damaged caused
  let statslinedc = d3.line()
    .x((d) => {
      console.log('Ln 61: date on x axis: ', d.date);
      return x(d.date);
    })
    .y((d) => {
      console.log('Ln 65: damaged caused on y axis: ', d.damage_caused);
      return y(d.damage_caused);
    });

  // shots
  let statslineshots = d3.line()
    .x((d) => {
      console.log('Ln 72: date on x axis: ', d.date);
      return x(d.date);
    })
    .y((d) => {
      console.log('Ln 76: shots on y axis: ', d.shots);
      return y(d.shots);
    });

  // Get the data
  stats.forEach(function (d) {
    console.log('Ln 82: this is d: ', d);
    console.log('Ln 83: date: ', d.created_at);
    d.date = new Date(d.created_at);
    console.log('Ln 85: parsed date: ', d.date);
		d.score = +d.score;
    console.log('Ln 87: d.score: ', d.score);
    d.hit_points = +d.hit_points;
    console.log('Ln 89: hit_points: ', d.hit_points);
    d.damage_caused = +d.damage_caused;
    console.log('Ln 91: damage_caused: ', d.damage_caused);
    d.shots = +d.shots;
    console.log('Ln 93: shots: ', d.shots);
  });

  // Adds the svg canvas
  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Scale the range of the data
  x.domain(d3.extent(stats, function (d) {
    return d.date;
  }));
  y.domain([0, d3.max(stats, function (d) {
    return d.score;
  })]);

  // Nest the entries by symbol
  const dataNest = d3.nest(stats)
    .key(function (d) {
      return d.symbol;
    })
    .entries(stats);

  // set the color scale
  let color = d3.scaleBand().range[('steelblue', '#f18436', '#519c3e', '#c73933')];
  console.log('Ln 121: color: ', color);

  // spacing for the legend
  let legendSpace = width / dataNest.length;
  console.log('Ln 124: legendSpace: ', legendSpace);

  // Loop through each symbol / key
  dataNest.forEach(function (d, i) {
    console.log('Ln 127: this is d: ', d);
        // score
        svg.append('path')
          .attr('class', 'line')
          .attr('fill', 'none')
          .attr('stroke-width', '3')
          .attr('stroke', 'steelblue')
          .attr('d', statsline(d.values));
          console.log('Ln 135: d.values score: ', d.values)

        // hit points
        svg.append('path')
          .attr('class', 'line')
          .attr('fill', 'none')
          .attr('stroke-width', '3')
          .attr('stroke', '#f18436')
          .attr('d', statslinehp(d.values));
          console.log('Ln 144: d.values hp: ', d.values);

        // damaged caused
        svg.append('path')
          .attr('class', 'line')
          .attr('fill', 'none')
          .attr('stroke-width', '3')
          .attr('stroke', '#519c3e')
          .attr('d', statslinedc(d.values));
          console.log('Ln 153: d.values damage_caused: ', d.values);

        // shots
        svg.append('path')
          .attr('class', 'line')
          .attr('fill', 'none')
          .attr('stroke-width', '3')
          .attr('stroke', '#c73933')
          .attr('d', statslineshots(d.values));
          console.log('Ln 162: d.values shots: ', d.values);

        // // Add the Legend
        // svg.append('text')
        //   .attr('x', (legendSpace / 2) + i * legendSpace) // space legend
        //   .attr('y', height + (margin.bottom / 2) + 5)
        //   .attr('class', 'legend')  // style the legend
        //   .style('fill', function fl() {  // Add the colours dynamically
        //     return d.color = color(d.key);
        //   })
        //   .on('click', function cl() {
        //     // Determine if current line is visible
        //     const active = d.active ? false : true,
        //       newOpacity = active ? 0 : 1;
        //     // Hide or show the elements based on the ID
        //     d3.select('#tag' + d.key.replace(/\s+/g, ''))
        //       .transition().duration(100)
        //       .style('opacity', newOpacity);
        //     // Update whether or not the elements are active
        //     d.active = active;
        //   })
        //   .text(d.key);

       //  // Add the legend
       // svg.append("text")
       //    .attr("x", (legendSpace/2) + i*legendSpace) // spacing
       //    .attr("y", height + (margin.bottom/2) + 5)
       //    .attr("class", "legend")  // style the legend
       //    .style("fill", function() {
       //      console.log("Ln 196: d.color: ", d.color);
       //       return d.color = color(d.key);
       //    })
       //    .on("click", function(){
       //       // Determine if current line is visable
       //       var active = d.active ? false : true,
       //       newOpacity = active ? 1 : 0;
       //       // Hide or show the elements based on the ID
       //       d3.selectAll("#tag"+d.key.replace(/\s+/g, ''))
       //         .transition().duration(100)
       //         .style("opacity", newOpacity);
       //       d3.select(this)
       //         .style("font-size", function() {
       //           if (active) {return "25px"}
       //         })
       //       // Update whether or not the elements are active
       //       console.log(active)
       //       d.active = active
       //       console.log(active)
       //    })
       //   .on("mouseover", function(){
       //       if (d.active != true) {
       //         d3.selectAll("#tag"+d.key.replace(/\s+/g, ''))
       //           .transition()
       //           .duration(50)
       //           .style("opacity", 1)
       //         d3.select(this)
       //           .transition()
       //           .duration(50)
       //           .style("font-size", function() {
       //             if (d.active != true) {return "25px"}
       //           })
       //           ;
       //       }
       //   //Get this bar's x/y values, then augment for the tooltip
       //   var xPosition =  legendSpace/2 + i*legendSpace // spacing
       //   var yPosition = height + (margin.bottom/2) + 5;
       //   //Update the tooltip position and value
       //   d3.select("#tooltip")
       //     .style("left", xPosition + "px")
       //     .style("top", yPosition - 30 + "px")
       //     .select("#value")
       //
       //     .text( desc ) ;
       //
       //   //Show the tooltip
       //   d3.select("#tooltip").classed("hidden", false);
       //
       //   })
       //   .on("mouseout", function() {
       //     if(d.active != true) {
       //         d3.selectAll("#tag"+d.key.replace(/\s+/g, ''))
       //           .transition()
       //           .duration(1000)
       //           .style("opacity", 0)
       //         d3.select(this)
       //           .transition()
       //           .duration(1000)
       //           .style("font-size", function() {
       //             return "16px"
       //           }
       //           )}
       //   //Hide the tooltip
       //   d3.select("#tooltip").classed("hidden", true);
       //
       //   })
       //   .text(d.key);
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
          drawPlayerChart(stats);
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

/* path line {
  stroke: steelblue;
  stroke-width: 3;
  fill: none;
} */

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
