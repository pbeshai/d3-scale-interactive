import { select } from 'd3-selection';
import * as d3Interpolate from 'd3-interpolate';
import { className } from './utils';
import d3Interpolators, { asString } from '../d3Interpolators';

export default class InterpolateSelector {
  constructor(parent, props) {
    this.parent = parent;
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
        .attr('class', className('interpolate-selector'));

    this.select = this.root.append('select')
      .property('selected', this.props.value)
      .on('change', function change() {
        const value = this.value;
        if (value !== 'null') {
          that.props.onChange(d3Interpolate[value]);
        }
      });

    this.select.append('option')
      .property('value', 'null')
      .text('Interpolate');

    d3Interpolators().forEach(interpolator => {
      this.select.append('option')
        .property('value', interpolator)
        .text(interpolator);
    });
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    this.select.property('value', asString(this.props.value));
  }
}
