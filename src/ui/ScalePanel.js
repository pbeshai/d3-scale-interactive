import { select } from 'd3-selection';
import { className, renderComponent } from './utils';
import TypeSelector from './TypeSelector';
import DomainInput from './DomainInput';
import RangeInput from './RangeInput';
import InterpolatorInput from './InterpolatorInput';
import InterpolateSelector from './InterpolateSelector';
import BooleanInput from './BooleanInput';
import NumberInput from './NumberInput';
import StatsPanel from './StatsPanel';

export default class ScalePanel {
  constructor(parent, props) {
    this.parent = parent;
    this.scaleProxy = props.scaleProxy;
    this.visible = true;
    this.statsVisible = false;

    // bind handlers
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleScalePropertyChange = this.handleScalePropertyChange.bind(this);
    this.handleDomainNice = this.handleDomainNice.bind(this);
    this.handleDomainChange = this.handleScalePropertyChange.bind(this, 'domain');
    this.handleRangeChange = this.handleScalePropertyChange.bind(this, 'range');
    this.handleInterpolatorChange = this.handleScalePropertyChange.bind(this, 'interpolator');
    this.handleClampChange = this.handleScalePropertyChange.bind(this, 'clamp');
    this.handleExponentChange = this.handleScalePropertyChange.bind(this, 'exponent');
    this.handleBaseChange = this.handleScalePropertyChange.bind(this, 'base');
    this.handleInterpolateChange = this.handleScalePropertyChange.bind(this, 'interpolate');
    this.handleRoundChange = this.handleScalePropertyChange.bind(this, 'round');
    this.handlePaddingChange = this.handleScalePropertyChange.bind(this, 'padding');
    this.handlePaddingInnerChange = this.handleScalePropertyChange.bind(this, 'paddingInner');
    this.handlePaddingOuterChange = this.handleScalePropertyChange.bind(this, 'paddingOuter');
    this.handleAlignChange = this.handleScalePropertyChange.bind(this, 'align');

    this.toggleView = this.toggleView.bind(this);
    this.toggleStats = this.toggleStats.bind(this);

    this.renderTypeSelector = this.renderTypeSelector.bind(this);
    this.renderDomainInput = this.renderDomainInput.bind(this);
    this.renderRangeInput = this.renderRangeInput.bind(this);
    this.renderInterpolatorInput = this.renderInterpolatorInput.bind(this);
    this.renderClampInput = this.renderClampInput.bind(this);
    this.renderExponentInput = this.renderExponentInput.bind(this);
    this.renderBaseInput = this.renderBaseInput.bind(this);
    this.renderInterpolateInput = this.renderInterpolateInput.bind(this);
    this.renderRoundInput = this.renderRoundInput.bind(this);
    this.renderPaddingInput = this.renderPaddingInput.bind(this);
    this.renderPaddingInnerInput = this.renderPaddingInnerInput.bind(this);
    this.renderPaddingOuterInput = this.renderPaddingOuterInput.bind(this);
    this.renderAlignInput = this.renderAlignInput.bind(this);

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

    this.messageContainer = this.root.append('div')
      .attr('class', className('message-container'));

    this.header = this.root.append('h3')
      .attr('class', className('panel-header'))
      .on('click', this.toggleView);

    this.inner = this.root.append('div')
      .attr('class', className('panel-inner'));

    this.controls = this.inner.append('div')
      .attr('class', className('scale-controls'));

    this.statsContainer = this.inner.append('div');

    this.itemsContainer = this.inner.append('div')
      .attr('class', className('panel-items'));

    this.pinButton = this.controls.append('button')
      .text('Pin')
      .attr('title', 'Pin these settings - ignores scale modifications made outside of the UI')
      .on('click', () => {
        if (this.scaleProxy.pinned) {
          this.showMessage('Using external scale changes');
          this.scaleProxy.unpin();
        } else {
          this.showMessage('Ignoring external scale changes');
          this.scaleProxy.pin();
        }
        this.pinButton.classed(className('active'), this.scaleProxy.pinned);
      });

    // generate code button
    this.controls.append('button')
      .text('Code')
      .attr('title', 'Output generated code to console')
      .on('click', () => {
        this.showMessage('Code printed in console');

        console.log(`const ${this.scaleProxy.name} = ${this.scaleProxy.generateCode()}`);
      });

    // send to window button
    this.controls.append('button')
      .text('Debug')
      .attr('title', 'Add scale to window to debug in console')
      .on('click', () => {
        this.showMessage('Added to console');

        /* eslint-disable no-underscore-dangle */
        window._scales = window._scales || {};
        const name = this.scaleProxy.name;
        window._scales[name] = this.scaleProxy.proxyScale;
        window._scales[`${name}Raw`] = this.scaleProxy.scale;
        window._scales[`${name}ScaleProxy`] = this.scaleProxy;

        console.log(`Added scale ${name} to _scales['${name}']...\n`, window._scales[name]);
        /* eslint-enable no-underscore-dangle */
      });

    this.statsButton = this.controls.append('button')
      .text('Stats')
      .on('click', this.toggleStats);

    this.controls.append('button')
      .attr('class', className('reset-button'))
      .text('Reset')
      .on('click', () => this.scaleProxy.reset());


    this.items = {};
  }

  // shows an ephemeral message in the panel header
  showMessage(message) {
    this.messageContainer.text(message);
    this.messageContainer.classed(className('visible'), true);

    const messageVisibleTime = 1000;

    if (this.messageTimer) {
      clearTimeout(this.messageTimer);
      this.messageTimer = null;
    }
    this.messageTimer = setTimeout(() => {
      this.messageContainer.classed(className('visible'), false);
      this.messageTimer = null;
    }, messageVisibleTime);
  }

  toggleStats() {
    this.statsVisible = !this.statsVisible;
    if (this.statsVisible) {
      console.log(`Stats for scale ${this.scaleProxy.name}\n`, this.scaleProxy.stats);
    }

    this.render();
  }

  toggleView() {
    this.visible = !this.visible;
    this.render();
  }

  handleDomainNice() {
    const newDomain = this.scaleProxy.proxyScale.nice().domain();
    this.scaleProxy.changeScaleProperty('domain', newDomain);
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
      maxLength: this.scaleProxy.scaleType === 'scaleSequential' ? 2 : undefined,
      range: this.scaleProxy.proxyScale.range && this.scaleProxy.proxyScale.range(),
    });
  }

  renderRangeInput(parentNode) {
    this.rangeInput = renderComponent(this.rangeInput, RangeInput, parentNode, {
      range: this.scaleProxy.proxyScale.range(),
      onChange: this.handleRangeChange,
      domain: this.scaleProxy.proxyScale.domain(),
      scale: this.scaleProxy.scale,
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

  renderBaseInput(parentNode) {
    this.baseInput = renderComponent(this.baseInput, NumberInput, parentNode, {
      value: this.scaleProxy.proxyScale.base(),
      min: 1,
      max: 20,
      step: 1,
      onChange: this.handleBaseChange,
    });
  }

  renderInterpolateInput(parentNode) {
    this.interpolateInput = renderComponent(this.interpolateInput, InterpolateSelector, parentNode, {
      value: this.scaleProxy.proxyScale.interpolate(),
      onChange: this.handleInterpolateChange,
    });
  }

  renderRoundInput(parentNode) {
    this.roundInput = renderComponent(this.roundInput, BooleanInput, parentNode, {
      value: this.scaleProxy.proxyScale.round(),
      onChange: this.handleRoundChange,
    });
  }

  renderPaddingInput(parentNode) {
    this.paddingInput = renderComponent(this.paddingInput, NumberInput, parentNode, {
      value: this.scaleProxy.proxyScale.padding(),
      min: 0,
      max: 1,
      step: 0.05,
      onChange: this.handlePaddingChange,
    });
  }

  renderPaddingInnerInput(parentNode) {
    this.paddingInnerInput = renderComponent(this.paddingInnerInput, NumberInput, parentNode, {
      value: this.scaleProxy.proxyScale.paddingInner(),
      min: 0,
      max: 1,
      step: 0.05,
      onChange: this.handlePaddingInnerChange,
    });
  }

  renderPaddingOuterInput(parentNode) {
    this.paddingOuterInput = renderComponent(this.paddingOuterInput, NumberInput, parentNode, {
      value: this.scaleProxy.proxyScale.paddingOuter(),
      min: 0,
      max: 1,
      step: 0.05,
      onChange: this.handlePaddingOuterChange,
    });
  }

  renderAlignInput(parentNode) {
    this.alignInput = renderComponent(this.alignInput, NumberInput, parentNode, {
      value: this.scaleProxy.proxyScale.align(),
      min: 0,
      max: 1,
      step: 0.05,
      onChange: this.handleAlignChange,
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
    this.renderItem('Base', this.renderBaseInput, 'base', 'baseInput');
    this.renderItem('Interpolate', this.renderInterpolateInput, 'interpolate', 'interpolateInput');

    this.renderItem('Round', this.renderRoundInput, 'round', 'roundInput');
    this.renderItem('Padding Inner', this.renderPaddingInnerInput, 'paddingInner', 'paddingInnerInput');
    this.renderItem('Padding Outer', this.renderPaddingOuterInput, 'paddingOuter', 'paddingOuterInput');
    this.renderItem('Padding', this.renderPaddingInput, 'padding', 'paddingInput');
    this.renderItem('Align', this.renderAlignInput, 'align', 'alignInput');
  }

  renderItem(label, renderItem, scaleProp, stateKey) {
    // if scaleProp is provided, only render if the scale has it, otherwise remove
    // e.g. don't render `interpolator` if no interpolator is available on the scale
    if (scaleProp) {
      // if scale doesn't have this prop or it is faked
      if (this.scaleProxy.proxyScale[scaleProp] == null || this.scaleProxy.fakedKeys[scaleProp]) {
        // remove the item if we have it currently
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

  renderStats() {
    this.statsContainer.style('display', this.statsVisible ? '' : 'none');
    this.statsButton.classed(className('active'), this.statsVisible);

    if (this.statsVisible) {
      this.statsPanel = renderComponent(this.statsPanel, StatsPanel, this.statsContainer.node(), {
        scaleProxy: this.scaleProxy,
      });
    }
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    this.root
      .classed(className('visible'), this.visible)
      .classed(className('hidden'), !this.visible);

    this.header.text(this.scaleProxy.name);
    if (this.visible) {
      this.renderItems();
      this.renderStats();
    }
  }
}
