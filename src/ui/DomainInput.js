import { select } from 'd3-selection';
import { className, renderComponent } from './utils';
import ArrayInput from './ArrayInput';

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
    // create the main panel div
    this.root = select(this.parent)
      .append('div')
        .attr('class', className('domain-input'));
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    const { domain, onChange } = this.props;
    this.arrayInput = renderComponent(this.arrayInput, ArrayInput, this.root.node(), {
      values: domain,
      minLength: 2,
      onChange,
    });
  }
}
