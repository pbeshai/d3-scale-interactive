import { select } from 'd3-selection';
import { extent, max, histogram } from 'd3-array';
import { scaleLinear, scaleTime, scaleUtc } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { className } from './utils';

export default class StatsHistogram {
  constructor(parent, props) {
    this.parent = parent;
    this.update(props);
  }

  update(nextProps) {
    this.props = nextProps;
    this.render();
  }

  setup() {
    const width = 240;
    const height = 80;
    const margin = { top: 5, right: 10, bottom: 25, left: 30 };
    this.innerWidth = width - margin.left - margin.right;
    this.innerHeight = height - margin.bottom - margin.top;

    // create the main panel div
    this.root = select(this.parent)
      .append('svg')
        .attr('class', className('stats-chart'))
        .attr('width', width)
        .attr('height', height);

    this.g = this.root.append('g')
      .attr('transform', `translate(${margin.left} ${margin.top})`);

    this.countRects = this.g.append('g')
      .attr('class', 'count-rects');

    this.xAxis = this.g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${this.innerHeight})`);

    this.yAxis = this.g.append('g')
      .attr('class', 'axis axis--y');
  }

  render() {
    if (!this.root) {
      this.setup();
    }
    const { data, timeScale } = this.props;

    // keep old data rendered when data resets
    if (!data.length) {
      return;
    }
    const innerHeight = this.innerHeight;
    const innerWidth = this.innerWidth;

    let xScale;
    if (timeScale === 'scaleTime') {
      xScale = scaleTime().range([0, innerWidth]);
    } else if (timeScale === 'scaleUtc') {
      xScale = scaleUtc().range([0, innerWidth]);
    } else {
      xScale = scaleLinear().range([0, innerWidth]);
    }

    const yScale = scaleLinear().range([innerHeight, 0]);

    // filter out infinite values
    const filteredData = data.filter(d => d < Infinity && d > -Infinity);

    const xExtent = extent(filteredData);
    xScale.domain(xExtent);
    this.xAxis.call(axisBottom(xScale).ticks(7));

    const bins = histogram()
      .domain(xScale.domain())
      .thresholds(xScale.ticks(20))(filteredData);

    yScale.domain([0, max(bins, d => d.length)]);
    this.yAxis.call(axisLeft(yScale).ticks(4));

    let bars = this.countRects.selectAll('.bar').data(bins);
    bars.exit().remove();
    const barsEnter = bars.enter().append('g').attr('class', 'bar');

    const sampleBin = bins[1] || bins[0]; // first one can be smaller so use second if available
    const barWidth = Math.max(1, xScale(sampleBin.x1) - xScale(sampleBin.x0) - 1);
    barsEnter
      .append('rect')
      .attr('x', 1)
      .attr('width', barWidth)
      .style('fill', '#0bb');

    bars = bars.merge(barsEnter)
      .attr('transform', d => `translate(${xScale(d.x0)}, ${yScale(d.length)})`)
      .each(function eachBar(d) {
        select(this).select('rect')
          .attr('x', 1)
          .attr('width', barWidth)
          .attr('height', innerHeight - yScale(d.length))
          .style('fill', '#0bb');
      });
  }
}
