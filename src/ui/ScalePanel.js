import { select } from 'd3-selection';
import { className, renderComponent } from './utils';
import TypeSelector from './TypeSelector';
import DomainInput from './DomainInput';
import RangeInput from './RangeInput';
import InterpolatorInput from './InterpolatorInput';
import BooleanInput from './BooleanInput';
import NumberInput from './NumberInput';

export default class ScalePanel {
  constructor(parent, props) {
    this.parent = parent;
    this.scaleProxy = props.scaleProxy;
    this.visible = true;

    // bind handlers
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleScalePropertyChange = this.handleScalePropertyChange.bind(this);
    this.handleDomainNice = this.handleDomainNice.bind(this);
    this.handleDomainChange = this.handleScalePropertyChange.bind(this, 'domain');
    this.handleRangeChange = this.handleScalePropertyChange.bind(this, 'range');
    this.handleInterpolatorChange = this.handleScalePropertyChange.bind(this, 'interpolator');
    this.handleClampChange = this.handleScalePropertyChange.bind(this, 'clamp');
    this.handleExponentChange = this.handleScalePropertyChange.bind(this, 'exponent');
    this.toggleView = this.toggleView.bind(this);

    this.renderTypeSelector = this.renderTypeSelector.bind(this);
    this.renderDomainInput = this.renderDomainInput.bind(this);
    this.renderRangeInput = this.renderRangeInput.bind(this);
    this.renderInterpolatorInput = this.renderInterpolatorInput.bind(this);
    this.renderClampInput = this.renderClampInput.bind(this);
    this.renderExponentInput = this.renderExponentInput.bind(this);

    // attach listeners
    this.scaleProxy.on('update.scale-panel', () => this.render());
    // note that we need proxy-set to catch any set up the user does
    // e.g. calling .domain([min, max]).
    this.scaleProxy.on('proxy-set.scale-panel', () => this.render());
    this.render();
  }

  update(nextProps) {
    this.props = nextProps;
    this.scaleProxy = nextProps.scaleProxy;

    this.render();
  }

  setup() {
    // create the main panel div
    this.root = select(this.parent)
      .append('div')
        .attr('class', className('panel'));

    this.header = this.root.append('h3')
      .attr('class', className('panel-header'))
      .on('click', this.toggleView);

    this.inner = this.root.append('div')
      .attr('class', className('panel-inner'));

    this.controls = this.inner.append('div')
      .attr('class', className('scale-controls'));

    this.itemsContainer = this.inner.append('div')
      .attr('class', className('panel-items'));

    // generate code button
    this.controls.append('button')
      .text('Code')
      .attr('title', 'Output generated code to console')
      .on('click', () => {
        console.log(`const ${this.scaleProxy.name} = ${this.scaleProxy.generateCode()}`);
      });

    // send to window button
    this.controls.append('button')
      .text('Debug')
      .attr('title', 'Add scale to window to debug in console')
      .on('click', () => {
        window._scales = window._scales || {};
        const name = this.scaleProxy.name;
        window._scales[name] = this.scaleProxy.proxyScale;
        window._scales[`${name}Raw`] = this.scaleProxy.scale;
        window._scales[`${name}ScaleProxy`] = this.scaleProxy;

        console.log(`Added scale ${name} to window._scales['${name}']...`, this.scaleProxy.proxyScale);
      });

    this.controls.append('button')
      .text('Stats')
      .on('click', () => console.log('TODO stats'));

    this.controls.append('button')
      .attr('class', className('reset-button'))
      .text('Reset')
      .on('click', () => this.scaleProxy.reset());


    this.items = {};
  }

  toggleView() {
    this.visible = !this.visible;
    this.render();
  }

  handleDomainNice() {
    this.scaleProxy.proxyScale.nice();
    this.scaleProxy.update();
  }

  handleTypeChange(newType) {
    this.scaleProxy.changeScaleType(newType);
  }

  handleScalePropertyChange(property, value) {
    this.scaleProxy.changeScaleProperty(property, value);
  }

  renderDomainInput(parentNode) {
    this.domainInput = renderComponent(this.domainInput, DomainInput, parentNode, {
      domain: this.scaleProxy.proxyScale.domain(),
      onChange: this.handleDomainChange,
      onNice: this.handleDomainNice,
      range: this.scaleProxy.proxyScale.range && this.scaleProxy.proxyScale.range(),
    });
  }

  renderRangeInput(parentNode) {
    this.rangeInput = renderComponent(this.rangeInput, RangeInput, parentNode, {
      range: this.scaleProxy.proxyScale.range(),
      onChange: this.handleRangeChange,
      domain: this.scaleProxy.proxyScale.domain(),
      scale: this.scaleProxy.proxyScale,
      continuous: this.scaleProxy.isContinuous(),
    });
  }

  renderInterpolatorInput(parentNode) {
    this.interpolatorInput = renderComponent(this.interpolatorInput, InterpolatorInput,
      parentNode, {
        interpolator: this.scaleProxy.proxyScale.interpolator(),
        onChange: this.handleInterpolatorChange,
      });
  }

  renderTypeSelector(parentNode) {
    this.typeSelector = renderComponent(this.typeSelector, TypeSelector, parentNode, {
      type: this.scaleProxy.scaleType,
      onChange: this.handleTypeChange,
    });
  }

  renderClampInput(parentNode) {
    this.clampInput = renderComponent(this.clampInput, BooleanInput, parentNode, {
      value: this.scaleProxy.proxyScale.clamp(),
      onChange: this.handleClampChange,
    });
  }

  renderExponentInput(parentNode) {
    this.exponentInput = renderComponent(this.exponentInput, NumberInput, parentNode, {
      value: this.scaleProxy.proxyScale.exponent(),
      min: 0,
      max: 20,
      step: 1,
      onChange: this.handleExponentChange,
    });
  }

  /**
   * Render the items that show up in the panel to edit
   * e.g., Type, Domain, Range, Interpolator
   */
  renderItems() {
    this.renderItem('Type', this.renderTypeSelector);
    this.renderItem('Domain', this.renderDomainInput, 'domain', 'domainInput');
    this.renderItem('Range', this.renderRangeInput, 'range', 'rangeInput');
    this.renderItem('Interpolator', this.renderInterpolatorInput, 'interpolator',
      'interpolatorInput');
    this.renderItem('Clamp', this.renderClampInput, 'clamp', 'clampInput');
    this.renderItem('Exponent', this.renderExponentInput, 'exponent', 'exponentInput');
  }

  renderItem(label, renderItem, scaleProp, stateKey) {
    // if scaleProp is provided, only render if the scale has it, otherwise remove
    // e.g. don't render `interpolator` if no interpolator is available on the scale
    if (scaleProp) {
      if (this.scaleProxy.proxyScale[scaleProp] == null) {
        if (this.items[label]) {
          this.items[label].remove();
          delete this.items[label];
          if (stateKey) {
            delete this[stateKey];
          }
        }
        return;
      }
    }

    let item = this.items[label];
    if (!item) {
      item = this.itemsContainer.append('div')
        .attr('class', className('panel-item'));
      this.items[label] = item;

      item.append('h4').text(label);
      item.append('div')
        .attr('class', className('panel-item-inner'));
    }

    const inner = item.select(`.${className('panel-item-inner')}`);
    renderItem(inner.node());
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    this.root
      .classed(className('visible'), this.visible)
      .classed(className('hidden'), !this.visible);

    this.header.text(this.scaleProxy.name);
    this.renderItems();
  }
}
