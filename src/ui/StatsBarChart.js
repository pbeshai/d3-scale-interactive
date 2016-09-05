import { select } from 'd3-selection';
import { max } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { color } from 'd3-color';
import { className } from './utils';

/**
 * Helper that returns true if the value is a color
 */
function isColor(value) {
  return value && color(value) != null;
}

export default class StatsBarChart {
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
    const { data, noXTicks } = this.props;

    // keep old data rendered when data resets
    if (!data.length) {
      return;
    }

    const innerHeight = this.innerHeight;
    const innerWidth = this.innerWidth;

    // setup the scales
    const xScale = scaleBand().rangeRound([0, innerWidth]).paddingInner(0.1);
    const yScale = scaleLinear().range([innerHeight, 0]);

    // const xExtent = extent(data, d => d.value);
    xScale.domain(data.map(d => d.value));
    yScale.domain([0, max(data, d => d.count)]);

    // setup the axes
    this.xAxis.call(axisBottom(xScale).ticks(7));
    this.yAxis.call(axisLeft(yScale).ticks(4));
    if (noXTicks) {
      this.xAxis.selectAll('.tick').remove();
    }

    // render the bars
    let bars = this.countRects.selectAll('.bar').data(data);
    bars.exit().remove();
    const barsEnter = bars.enter().append('g').attr('class', 'bar');

    const barWidth = xScale.bandwidth();

    barsEnter
      .append('rect')
      .attr('x', 1)
      .attr('width', barWidth)
      .style('fill', '#0bb');

    bars = bars.merge(barsEnter)
      .attr('transform', d => `translate(${xScale(d.value)}, ${yScale(d.count)})`)
      .each(function eachBar(d) {
        select(this).select('rect')
          .attr('x', 1)
          .attr('width', barWidth)
          .attr('height', innerHeight - yScale(d.count))
          .style('fill', d => (isColor(d.value) ? d.value : '#0bb'));
      });
  }
}
