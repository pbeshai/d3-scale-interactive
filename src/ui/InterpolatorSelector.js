import { select } from 'd3-selection';
import { className } from './utils';

function d3Interpolators() {
  const list = [
    'interpolateViridis', 'interpolateInferno', 'interpolateMagma', 'interpolatePlasma',
    'interpolateWarm', 'interpolateCool', 'interpolateRainbow',
    'interpolateCubehelixDefault', 'interpolateBrBG', 'interpolatePRGn',
    'interpolatePiYG', 'interpolatePuOr', 'interpolateRdBu', 'interpolateRdGy',
    'interpolateRdYlBu', 'interpolateRdYlGn', 'interpolateSpectral',
    'interpolateBlues', 'interpolateGreens', 'interpolateGreys', 'interpolateOranges',
    'interpolatePurples', 'interpolateReds', 'interpolateBuGn', 'interpolateBuPu',
    'interpolateGnBu', 'interpolateOrRd', 'interpolatePuBuGn', 'interpolatePuBu',
    'interpolatePuRd', 'interpolateRdPu', 'interpolateYlGnBu', 'interpolateYlGn',
    'interpolateYlOrBr', 'interpolateYlOrRd'];

  // filter only those available in case d3-scale-chromatic not there
  return list.filter(name => (window.d3 ? window.d3[name] : true));
}

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
