/* eslint-disable */
var categories = ['one', 'two', 'three', 'four', 'five'];
function generateRandom(length) {
  var xRandomizer = d3.randomNormal(150, 30);
  var yRandomizer = d3.randomLogNormal(3, 1.2);
  var vRandomizer = d3.randomNormal(150, 50);
  var catRandomizer = d3.randomNormal(2.5, 1);
  return d3.range(length).map(function () {
    return {
      // data for linear:
      x: Math.round(xRandomizer()),
      // data for categorical:
      // x: categories[Math.min(categories.length - 1, Math.max(0, Math.floor(catRandomizer())))],
      // data for time:
      // x: new Date(2016, Math.floor(Math.random() * 12), Math.ceil(Math.random() * 30)),
      y: Math.round(yRandomizer()),
      v: Math.round(vRandomizer()),
    };
  });
}

// set global options
// d3.scaleInteractive.options({ startHidden: true });

function setupChart(data) {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  color = d3.scaleInteractive('color', updateChart)
    .scaleSequential(d3.interpolateMagma)
    // .scaleOrdinal(d3.schemeCategory10)
    .domain(d3.extent(data, function (d) { return d.v; }));

  x = d3.scaleInteractive('x', updateChart)
  // x = d3
      .scaleLinear()
      .domain(d3.extent(data, function (d) { return d.x; }))
      .range([0, width]);

  // switch to this for time
  // x = d3.scaleInteractive('x', updateChart)
  // // x = d3
      // .scaleTime()
      // .domain(d3.extent(data, function (d) { return d.x; }))
      // .range([0, width]);


  // switch to this for categorical and comment out x.domain(d3.extent ...) below
  // x = d3.scaleInteractive('cat', updateChart)
  // // x = d3
      // .scalePoint()
      // .domain(categories)
      // .range([0, width]);

  y = d3.scaleInteractive('y', updateChart)
  // y = d3
      .scaleLinear()
      .domain(d3.extent(data, function (d) { return d.y; }))
      .range([height, 0]);


  xAxis = d3.axisBottom(x);
  yAxis = d3.axisLeft(y);

  svg = d3.select('.chart-container').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


  x.domain(d3.extent(data, function(d) { return d.x; })).nice(); // comment this out for categorical
  y.domain(d3.extent(data, function(d) { return d.y; })).nice();

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')

  svg.append('g')
      .attr('class', 'y axis')

  updateChart(data);
}


function updateChart(newData) {
  newData = newData || data;

  // update axes
  svg.select('.x.axis').call(xAxis);
  svg.select('.y.axis').call(yAxis);

  // update circles
  var binding = svg.selectAll('.dot').data(newData);

  // ENTER
  var entering = binding.enter().append('circle')
    .classed('dot', true)
    .attr('cx', function(d) { return x(d.x); })
    .attr('cy', function(d) { return y(d.y); })

  // ENTER + UPDATE
  binding.merge(entering)
    .transition()
      .attr('r', 5.5)
      .attr('cx', function(d) { return x(d.x); })
      .attr('cy', function(d) { return y(d.y); })
      .style('fill', function(d) { return color(d.v); })
      .style('stroke', function (d) {
        var colorValue = d3.color(color(d.v));

        return colorValue ? colorValue.darker() : null });

  // EXIT
  binding.exit().remove();
}


// generate the data
var data = generateRandom(100);

// shared chart properties
var x, y, xAxis, yAxis, color, svg;

// create the chart
setupChart(data);


