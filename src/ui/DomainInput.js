import { select } from 'd3-selection';
import { className } from './utils';

// https://github.com/rollup/rollup/wiki/Troubleshooting#avoiding-eval
const eval2 = eval;

export default class DomainInput {
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
        .attr('class', className('domain-input'));

    this.input = this.root.append('input')
      .attr('class', className('input-field'))
      .attr('type', 'text')
      .on('change', function change() {
        const value = eval2(this.value);
        that.props.onChange(value);
      });
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    this.input.property('value', JSON.stringify(this.props.domain));
  }
}
