import { select } from 'd3-selection';
import { className } from './utils';
import d3Interpolators from '../d3Interpolators';

export default class InterpolatorSelector {
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
        .attr('class', className('interpolator-selector'));

    this.select = this.root.append('select')
      .property('selected', this.props.interpolator)
      .on('change', function change() {
        const value = this.value;
        if (value !== 'null') {
          that.props.onChange(value);
        }
      });

    this.select.append('option')
      .property('value', 'null')
      .text('Interpolator');

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

    this.select.property('value', this.props.interpolator);
  }
}
