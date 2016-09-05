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

    this.rangeRoot = this.root.append('div')
      .attr('class', className('stats-range'));

    this.rangeRoot.append('h4')
      .text('Range Counts');
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    const { scaleProxy } = this.props;

    this.domainChart = renderComponent(this.domainChart, StatsChart, this.domainRoot.node(), {
      data: scaleProxy.stats.domainHistogram,
    });

    this.rangeChart = renderComponent(this.rangeChart, StatsChart, this.rangeRoot.node(), {
      data: scaleProxy.stats.rangeHistogram,
    });
  }
}
