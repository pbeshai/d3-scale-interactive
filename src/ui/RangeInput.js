import { select } from 'd3-selection';
import { range as d3Range } from 'd3-array';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import { color } from 'd3-color';
import { className, renderComponent } from './utils';
import ArrayInput from './ArrayInput';
import ColorBar from './ColorBar';
import ColorSchemeSelector from './ColorSchemeSelector';

export default class RangeInput {
  constructor(parent, props) {
    this.parent = parent;
    this.handleColorSchemeChange = this.handleColorSchemeChange.bind(this);

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
        .attr('class', className('range-input'));

    this.inner = this.root.append('div');

    this.controls = this.root.append('div')
      .attr('class', className('domain-controls'));

    this.matchDomain = this.controls.append('button')
      .text('Match Domain Length')
      .on('click', () => this.handleMatchDomain());
  }

  // match the length including the end points (note that range isn't always numbers)
  handleMatchDomain() {
    const { domain, range, onChange } = this.props;

    if (domain.length === range.length) {
      return;
    }

    const rangeMin = range[0];
    const rangeMax = range[range.length - 1];
    const step = Math.round(1000 * ((rangeMax - rangeMin) / (domain.length - 1))) / 1000;

    let matched;
    // non-number solution - just copy the last element or truncate the array
    if (isNaN(step)) {
      const numToAdd = domain.length - range.length;
      if (numToAdd > 0) { // adding elements
        matched = [...range, ...d3Range(numToAdd).map(() => range[range.length - 1])];
      } else { // removing elements
        matched = range.slice(0, domain.length);
      }
    } else {
      matched = d3Range(rangeMin, rangeMax, step).concat(rangeMax);
    }

    onChange(matched);
  }

  handleColorSchemeChange(scheme) {
    const newRange = d3Scale[scheme] || d3ScaleChromatic[scheme];
    if (newRange) {
      this.props.onChange(newRange);
    }
  }

  /**
   * Returns true if this range is a bunch of colors
   *
   * @return {Boolean}
   */
  isColorRange() {
    const { range } = this.props;
    return color(range && range[0]) != null;
  }

  renderColorBar() {
    const { continuous, domain, range, scale } = this.props;

    if (this.isColorRange()) {
      let colors = range;
      // if a continuous scale, interpolate the color bar
      if (continuous) {
        const domainMin = domain[0];
        const domainMax = domain[domain.length - 1];
        colors = d3Range(domainMin, domainMax, (domainMax - domainMin) / 100).map(d => scale(d));
      }

      this.colorBar = renderComponent(this.colorBar, ColorBar, this.inner.node(), {
        colors,
      });
    } else if (this.colorBar) {
      this.colorBar.root.remove();
      this.colorBar = null;
    }
  }

  renderColorSchemeSelector() {
    if (this.isColorRange()) {
      this.colorSchemeSelector = renderComponent(this.colorSchemeSelector, ColorSchemeSelector,
        this.inner.node(), {
          scheme: this.props.range,
          onChange: this.handleColorSchemeChange,
        });
    } else if (this.colorSchemeSelector) {
      this.colorSchemeSelector.root.remove();
      this.colorSchemeSelector = null;
    }
  }

  render() {
    const { range, onChange } = this.props;

    if (!this.root) {
      this.setup();
    }

    this.arrayInput = renderComponent(this.arrayInput, ArrayInput, this.inner.node(), {
      values: range,
      minLength: 2,
      onChange,
    });

    this.renderColorBar();
    this.renderColorSchemeSelector();
  }
}
