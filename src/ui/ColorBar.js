import { select } from 'd3-selection';
import { className } from './utils';

export default class ColorBar {
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
        .attr('class', className('color-bar'));
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    const { colors } = this.props;
    const binding = this.root.selectAll('div').data(colors);

    const availableWidth = 240;
    const colorWidth = (availableWidth) / colors.length;

    // ENTER
    const entering = binding.enter().append('div')
      .attr('class', className('color-bar-box'));

    // ENTER + UPDATE
    binding.merge(entering)
      .style('background-color', d => d)
      .style('width', `${colorWidth}px`);

    // EXIT
    binding.exit().remove();
  }
}
