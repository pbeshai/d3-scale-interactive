import { select } from 'd3-selection';
import { className, renderComponent } from './utils';
import ScalePanel from './ScalePanel';
import css from './cssWrapper';

export default class MainContainer {
  constructor(parent, props = {}) {
    this.parent = parent;
    this.visible = !props.startHidden;

    this.scaleProxies = [];
    this.panels = [];

    this.toggleView = this.toggleView.bind(this);

    this.update(props);
  }

  update(nextProps) {
    this.props = nextProps;
    this.render();
  }

  addScale(scaleProxy) {
    this.scaleProxies.push(scaleProxy);
    this.render();
  }

  setup() {
    // create the main panel div
    this.root = select(this.parent)
      .append('div')
        .attr('class', className('main'))
        .datum(this);

    this.inner = this.root.append('div')
      .attr('class', className('main-inner'));

    this.toggle = this.root.append('div')
      .attr('class', className('main-toggle'))
      .on('click', this.toggleView);

    // add in CSS
    this.root.append('style').attr('class', 'd3-scale-interactive-style').text(css);

    // resize height on window resize
    select(window).on('resize', () => { this.updateHeight(); });
  }

  toggleView() {
    this.visible = !this.visible;
    this.render();
  }

  updateHeight() {
    // set the max height
    this.root.style('max-height', `${window.innerHeight}px`);
  }

  renderScales() {
    this.scaleProxies.forEach((scaleProxy, i) => {
      this.panels[i] = renderComponent(this.panels[i], ScalePanel, this.inner.node(), {
        scaleProxy,
      });
    });
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    // set the max height
    this.updateHeight();

    this.root
      .classed(className('visible'), this.visible)
      .classed(className('hidden'), !this.visible);

    this.toggle.text(this.visible ? 'Hide scales' : 'Show d3-scale-interactive');
    if (this.visible) {
      this.renderScales();
    }
  }
}
