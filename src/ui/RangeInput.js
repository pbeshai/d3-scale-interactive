import { select } from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import { color } from 'd3-color';
import { className, renderComponent } from './utils';
import ColorBar from './ColorBar';
import ColorSchemeSelector from './ColorSchemeSelector';

// https://github.com/rollup/rollup/wiki/Troubleshooting#avoiding-eval
const eval2 = eval;

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
    const that = this;
    // create the main panel div
    this.root = select(this.parent)
      .append('div')
        .attr('class', className('range-input'));

    this.input = this.root.append('input')
      .attr('class', className('input-field'))
      .attr('type', 'text')
      .on('change', function change() {
        const value = eval2(this.value);
        that.props.onChange(value);
      });
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
    if (this.isColorRange()) {
      this.colorBar = renderComponent(this.colorBar, ColorBar, this.root.node(), {
        colors: this.props.range,
      });
    } else if (this.colorBar) {
      this.colorBar.root.remove();
      this.colorBar = null;
    }
  }

  renderColorSchemeSelector() {
    if (this.isColorRange()) {
      this.colorSchemeSelector = renderComponent(this.colorSchemeSelector, ColorSchemeSelector,
        this.root.node(), {
          scheme: null,
          onChange: this.handleColorSchemeChange,
        });
    } else if (this.colorSchemeSelector) {
      this.colorSchemeSelector.root.remove();
      this.colorSchemeSelector = null;
    }
  }

  render() {
    const { range } = this.props;

    if (!this.root) {
      this.setup();
    }

    this.input.property('value', JSON.stringify(range));

    this.renderColorBar();
    this.renderColorSchemeSelector();
  }
}
