import { select } from 'd3-selection';
import { className, renderComponent } from './utils';
import StatsChart from './StatsChart';

export default class StatsPanel {
  constructor(parent, props) {
    this.parent = parent;
    this.update(props);
  }

  update(nextProps) {
    this.props = nextProps;
    this.render();
  }

  setup() {
    // create the main panel div
    this.root = select(this.parent)
      .append('div')
        .attr('class', className('stats-panel'));

    this.domainRoot = this.root.append('div')
      .attr('class', className('stats-domain'));

    this.domainRoot.append('h4')
      .text('Domain Counts');

    this.domainStatus = this.domainRoot.append('span')
      .attr('class', className('stats-status'));

    this.rangeRoot = this.root.append('div')
      .attr('class', className('stats-range'));

    this.rangeRoot.append('h4')
      .text('Range Counts');

    this.rangeStatus = this.rangeRoot.append('span')
      .attr('class', className('stats-status'));
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    const { scaleProxy } = this.props;

    // draw the domain chart if continuous or sequential
    if (scaleProxy.isContinuous() || scaleProxy.scaleType === 'scaleSequential') {
      this.domainChart = renderComponent(this.domainChart, StatsChart, this.domainRoot.node(), {
        data: scaleProxy.stats.domainHistogram,
      });
      this.domainStatus.text('');
    } else {
      if (this.domainChart) {
        this.domainChart.remove();
        this.domainChart = null;
      }
      this.domainStatus.text('Not available');
    }

    // draw range chart if continuous
    if (scaleProxy.isContinuous() && typeof scaleProxy.proxyScale.range()[0] === 'number') {
      this.rangeChart = renderComponent(this.rangeChart, StatsChart, this.rangeRoot.node(), {
        data: scaleProxy.stats.rangeHistogram,
      });
      this.rangeStatus.text('');
    } else {
      if (this.rangeChart) {
        this.rangeChart.remove();
        this.rangeChart = null;
      }
      this.rangeStatus.text('Not available');
    }
  }
}
