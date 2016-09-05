import { select } from 'd3-selection';
import { range } from 'd3-array';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import { className, renderComponent } from './utils';
import ColorBar from './ColorBar';
import InterpolatorSelector from './InterpolatorSelector';

export default class InterpolatorInput {
  constructor(parent, props) {
    this.parent = parent;
    this.handleInterpolatorChange = this.handleInterpolatorChange.bind(this);

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
        .attr('class', className('interpolator-input'));
  }

  handleInterpolatorChange(interpolator) {
    const newInterpolator = d3Scale[interpolator] || d3ScaleChromatic[interpolator];
    if (newInterpolator) {
      this.props.onChange(newInterpolator);
    }
  }

  renderColorBar() {
    const interpolatorColors = range(0, 1, 0.01).map(t => this.props.interpolator(t));
    this.colorBar = renderComponent(this.colorBar, ColorBar, this.root.node(), {
      colors: interpolatorColors,
    });
  }

  renderInterpolatorSelector() {
    this.interpolatorSelector = renderComponent(this.interpolatorSelector, InterpolatorSelector,
      this.root.node(), {
        interpolator: this.props.interpolator,
        onChange: this.handleInterpolatorChange,
      });
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    this.renderColorBar();
    this.renderInterpolatorSelector();
  }
}
