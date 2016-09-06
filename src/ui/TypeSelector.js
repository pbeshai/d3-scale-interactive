import { select } from 'd3-selection';
import { className } from './utils';
import supportedScales from '../supportedScales';

export default class TypeSelector {
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
        .attr('class', className('type-selector'));

    this.select = this.root.append('select')
      .property('selected', this.props.type)
      .on('change', function change() {
        const value = this.value;
        if (value !== 'null') {
          that.props.onChange(value);
        }
      });

    this.select.append('option')
      .property('value', 'null')
      .text('Scale Type');

    supportedScales.forEach(scaleFuncName => {
      this.select.append('option')
        .property('value', scaleFuncName)
        .text(scaleFuncName);
    });

    this.docsLink = this.root.append('a')
      .attr('target', '_blank')
      .text('docs');
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    const { type } = this.props;

    this.docsLink.attr('href', `https://github.com/d3/d3-scale#${type}`);
    this.select.property('value', this.props.type);
  }
}
