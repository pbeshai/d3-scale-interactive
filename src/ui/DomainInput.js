import { select } from 'd3-selection';
import { range as d3Range } from 'd3-array';
import { className, renderComponent } from './utils';
import ArrayInput from './ArrayInput';

export default class DomainInput {
  constructor(parent, props) {
    this.parent = parent;
    this.update(props);

    this.handleMatchRange = this.handleMatchRange.bind(this);
  }

  update(nextProps) {
    this.props = nextProps;
    this.render();
  }

  // match the length including the end points
  handleMatchRange() {
    const { domain, range, onChange } = this.props;
    const domainMin = domain[0];
    const domainMax = domain[domain.length - 1];
    const step = Math.round(1000 * ((domainMax - domainMin) / (range.length - 1))) / 1000;
    const matched = d3Range(domainMin, domainMax, step).concat(domainMax);
    onChange(matched);
  }

  setup() {
    // create the main panel div
    this.root = select(this.parent)
      .append('div')
        .attr('class', className('domain-input'));

    this.inner = this.root.append('div');

    this.controls = this.root.append('div')
      .attr('class', className('domain-controls'));

    this.matchRange = this.controls.append('button')
      .text('Match Range Length')
      .on('click', () => this.handleMatchRange());

    this.controls.append('button')
      .text('Nice')
      .on('click', this.props.onNice);
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    const { domain, onChange, range, maxLength } = this.props;

    this.matchRange.style('display', range ? '' : 'none');

    this.arrayInput = renderComponent(this.arrayInput, ArrayInput, this.inner.node(), {
      values: domain,
      minLength: 2,
      maxLength,
      onChange,
    });
  }
}
