import { select } from 'd3-selection';
import { hsl } from 'd3-color';
import { className, renderComponent } from './utils';
import StatsHistogram from './StatsHistogram';
import StatsBarChart from './StatsBarChart';

function countArray(counts, mapFrom) {
  mapFrom = mapFrom || Object.keys(counts).sort();
  return mapFrom.map(value => ({
    value,
    count: counts[value] || 0,
  }));
}

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

    this.domainChartContainer = this.domainRoot.append('div');

    this.rangeRoot = this.root.append('div')
      .attr('class', className('stats-range'));

    this.rangeRoot.append('h4')
      .text('Range Counts');

    this.rangeStatus = this.rangeRoot.append('span')
      .attr('class', className('stats-status'));

    this.rangeChartContainer = this.rangeRoot.append('div');
  }

  renderDomainChart() {
    const { scaleProxy } = this.props;
    const domain = scaleProxy.proxyScale.domain && scaleProxy.proxyScale.domain();

    // draw the domain chart if continuous or sequential
    if (scaleProxy.isContinuous() || scaleProxy.scaleType === 'scaleSequential') {
      this.domainChart = renderComponent(this.domainChart, StatsHistogram, this.domainChartContainer.node(), {
        data: scaleProxy.stats.domainHistogram,
        timeScale: scaleProxy.isTimeScale() && scaleProxy.scaleType,
      });
      this.domainStatus.text('');

    // ordinal
    } else if (scaleProxy.isOrdinal()) {
      this.domainChart = renderComponent(this.domainChart, StatsBarChart, this.domainChartContainer.node(), {
        data: countArray(scaleProxy.stats.domainCounts, domain),
      });
      this.domainStatus.text('');

    // not supported, so remove it
    } else {
      if (this.domainChart) {
        this.domainChartContainer.selectAll('*').remove();
        this.domainChart = null;
      }
      this.domainStatus.text('Not available');
    }
  }


  renderRangeChart() {
    const { scaleProxy } = this.props;

    // draw range chart if continuous
    if (scaleProxy.isContinuous() && typeof scaleProxy.proxyScale.range()[0] === 'number') {
      this.rangeChart = renderComponent(this.rangeChart, StatsHistogram, this.rangeChartContainer.node(), {
        data: scaleProxy.stats.rangeHistogram,
      });
      this.rangeStatus.text('');

    // ordinal
    } else if (scaleProxy.isOrdinal()) {
      const counts = countArray(scaleProxy.stats.rangeCounts);
      this.rangeChart = renderComponent(this.rangeChart, StatsBarChart, this.rangeChartContainer.node(), {
        data: counts,
        noXTicks: counts.length > 7,
      });
      this.rangeStatus.text('');

    // sequential is special case
    } else if (scaleProxy.isContinuous() || scaleProxy.scaleType === 'scaleSequential') {
      // order the keys by HSL lightness
      const keysByLightness = Object.keys(scaleProxy.stats.rangeCounts).sort((a, b) =>
        hsl(a).l - hsl(b).l
      );

      this.rangeChart = renderComponent(this.rangeChart, StatsBarChart, this.rangeChartContainer.node(), {
        data: countArray(scaleProxy.stats.rangeCounts, keysByLightness),
        noXTicks: true,
      });
      this.rangeStatus.text('');

    // not supported
    } else {
      if (this.rangeChart) {
        this.rangeChartContainer.selectAll('*').remove();
        this.rangeChart = null;
      }
      this.rangeStatus.text('Not available');
    }
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    this.renderDomainChart();
    this.renderRangeChart();
  }
}
