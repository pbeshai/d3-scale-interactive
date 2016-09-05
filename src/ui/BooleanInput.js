import { select } from 'd3-selection';
import { className } from './utils';

export default class BooleanInput {
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
        .attr('class', className('boolean-input'));

    const that = this;
    this.input = this.root.append('input')
      .attr('type', 'checkbox')
      .on('change', function changeCheck() {
        that.props.onChange(this.checked);
      });
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    this.input.property('checked', this.props.value);
  }
}
