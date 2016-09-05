import { select } from 'd3-selection';
import { className } from './utils';
import d3ColorSchemes, { asString } from '../d3ColorSchemes';

export default class ColorSchemeSelector {
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
        .attr('class', className('color-scheme-selector'));

    this.select = this.root.append('select')
      .property('selected', this.props.scheme)
      .on('change', function change() {
        const value = this.value;
        if (value !== 'null') {
          that.props.onChange(value);
        }
      });

    this.select.append('option')
      .property('value', 'null')
      .text('Color Scheme');

    d3ColorSchemes().forEach(scheme => {
      this.select.append('option')
        .property('value', scheme)
        .text(scheme);
    });
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    this.select.property('value', asString(this.props.scheme));
  }
}
