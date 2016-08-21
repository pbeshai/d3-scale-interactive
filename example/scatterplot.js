/* eslint-disable */
function generateRandom(length) {
  var xRandomizer = d3.randomNormal(150, 30);
  var yRandomizer = d3.randomLogNormal(3, 1.2);
  var vRandomizer = d3.randomNormal(150, 50);
  return d3.range(length).map(() => ({
    x: Math.round(xRandomizer()),
    y: Math.round(yRandomizer()),
    v: Math.round(vRandomizer())
  }));
}

function setupChart(data) {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  color = d3.scaleInteractive('color', updateChart)
    .scaleSequential(d3.interpolateMagma)
    // .scaleOrdinal(d3.schemeCategory10)
    .domain(d3.extent(data, d => d.v));

  x = d3.scaleInteractive('x', updateChart)
  // x = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.x))
      .range([0, width]);

  y = d3.scaleInteractive('y', updateChart)
  // y = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.y))
      .range([height, 0]);


  xAxis = d3.axisBottom(x);
  yAxis = d3.axisLeft(y)

  svg = d3.select('.chart-container').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


  x.domain(d3.extent(data, function(d) { return d.x; })).nice();
  y.domain(d3.extent(data, function(d) { return d.y; })).nice();

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')

  svg.append('g')
      .attr('class', 'y axis')

  updateChart(data);
}


function updateChart(newData = data) {
  // update axes
  svg.select('.x.axis').call(xAxis);
  svg.select('.y.axis').call(yAxis);

  // update circles
  var binding = svg.selectAll('.dot').data(newData);

  // ENTER
  var entering = binding.enter().append('circle').classed('dot', true);

  // ENTER + UPDATE
  binding.merge(entering)
    .transition()
      .attr('r', 5.5)
      .attr('cx', function(d) { return x(d.x); })
      .attr('cy', function(d) { return y(d.y); })
      .style('fill', function(d) { return color(d.v); })
      .style('stroke', function (d) {
        const colorValue = d3.color(color(d.v));

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


