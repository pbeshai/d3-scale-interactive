(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('d3-dispatch'), require('d3-scale'), require('d3-scale-chromatic'), require('d3-color'), require('d3-array')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-dispatch', 'd3-scale', 'd3-scale-chromatic', 'd3-color', 'd3-array'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3,global.d3,global.d3,global.d3));
}(this, (function (exports,d3Selection,d3Dispatch,d3Scale,d3ScaleChromatic,d3Color,d3Array) { 'use strict';

var supportedScales = ['scaleSequential', 'scaleOrdinal', 'scaleLinear', 'scaleLog', 'scalePow'];

var ignoreKeysOnRead = ['copy'];

/**
 * Copy from the readScales to the writeScale
 *
 * @param {Function} writeScale an instantiated scale to write properties to
 * @param {Function} readScales an instantiated scale to read properties from
 * @return {Function} writeScale with updated properties
 */
function readFromScale(writeScale) {
  for (var _len = arguments.length, readScales = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    readScales[_key - 1] = arguments[_key];
  }

  function processKey(key) {
    if (typeof writeScale[key] === 'function' && !ignoreKeysOnRead.includes(key)) {
      // use the value from the first read scale that has this function
      for (var i = 0; i < readScales.length; i++) {
        var readScale = readScales[i];
        if (readScale && readScale[key]) {
          try {
            var value = readScale[key]();
            writeScale[key](value);
            break;
          } catch (e) {/* do nothing */}
        }
      }
    }
  }

  Object.keys(writeScale).forEach(processKey);
  return writeScale;
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Events = {
  // when we change the scale, update is fired
  update: 'update',

  // any time a setter is called on the scale, proxySet is fired
  proxySet: 'proxy-set'
};

// needed for on change scale by type to ensure we have valid initial settings
var defaultScales = {
  scaleOrdinal: d3Scale.scaleOrdinal(d3Scale.schemeCategory10),
  scaleSequential: d3Scale.scaleSequential(d3Scale.interpolateMagma),
  scalePow: d3Scale.scalePow().exponent(10)
};

/**
 * Class for proxying a d3 scale so it can change type and keep stats
 * without changing its reference or interface.
 */

var ScaleProxy = function () {

  /**
   * Constructor
   * @param {String} name The name of the scale
   * @param {Function} update The function to call to redraw a chart
  */
  function ScaleProxy(name) {
    classCallCheck(this, ScaleProxy);

    this.name = name;
    this.dispatch = d3Dispatch.dispatch(Events.update, Events.proxySet);
    this.statsReset();

    this.scale = null;
    this.originalScale = null;
    this.proxyScale = this.proxyScale.bind(this);
  }

  createClass(ScaleProxy, [{
    key: 'on',
    value: function on(event, callback) {
      this.dispatch.on(event, callback);
      return this;
    }
  }, {
    key: 'update',
    value: function update() {
      this.dispatch.call(Events.update, this);
    }

    /**
     * Changes the active scale and returns the proxy scale.
     *
     * @param {Function} scale The new active scale to set (e.g. d3.scaleLinear())
     * @param {String} [scaleType] A key for identifying the type of scale being set
     * @return {Function} the proxy scale
     */

  }, {
    key: 'changeScale',
    value: function changeScale(scale, scaleType) {
      if (this.originalScale === null) {
        this.originalScale = scale.copy();
        this.originalScaleType = scaleType;
      }
      this.scaleType = scaleType;
      this.scale = scale;
      this.updateProxyScaleFunctions(scale);
      this.statsReset();

      this.update();

      return this.proxyScale;
    }

    /**
     * Once the initial scale has been set up, save it with this function
     * to get reset working properly.
     */

  }, {
    key: 'saveAsOriginalScale',
    value: function saveAsOriginalScale() {
      this.originalScale = this.scale;
      this.originalScaleType = this.scaleType;
    }

    /**
     * Change the current scale to a new scale type while retaining as much
     * similar values as possible.
     *
     * @param {String} scaleFuncName The name of the scale to change to (e.g. "scaleLinear")
     * @return {Function} the proxy scale
     */

  }, {
    key: 'changeScaleType',
    value: function changeScaleType(scaleType) {
      var newScale = readFromScale(d3Scale[scaleType](), this.scale, defaultScales[scaleType]);

      // ensure minimum domain is non-zero for log scale
      if (scaleType === 'scaleLog') {
        var domain = newScale.domain();
        newScale.domain([Math.max(1, domain[0]), Math.max(1, domain[1])]);
      }

      return this.changeScale(newScale, scaleType);
    }

    /**
     * Change a property in the scale, such as domain, range, interpolator
     *
     * @param {String} property the name of the property (e.g. "domain")
     * @param {Any} value the value to set the property to
     * @return {Function} the proxy scale
     */

  }, {
    key: 'changeScaleProperty',
    value: function changeScaleProperty(property, value) {
      this.proxyScale[property](value);
      this.statsReset();
      this.update();
      return this.proxyScale;
    }

    /**
     * Proxy whatever the currently set scale is so that we can change the
     * scale type dynamically without the user code having to update their
     * references to their scales.
     *
     * Also allows tracking of stats on each call to the scale.
     *
     * @param {Any} value Passed directly to the active d3 scale.
     * @return {Any} Whatever the active d3 scale returns
     */

  }, {
    key: 'proxyScale',
    value: function proxyScale(value) {
      var result = this.scale(value);
      this.statsRecordValueUsed(value, result);
      return result;
    }

    /**
     * Make sure all functions from the active scale are available on the
     * proxy. This allows the proxy to be used directly in place of the
     * active scale without user code knowing it.
     *
     * @param {Function} scale (e.g. d3.scaleLinear())
     */

  }, {
    key: 'updateProxyScaleFunctions',
    value: function updateProxyScaleFunctions(scale) {
      var _this = this;

      var newScaleKeys = Object.keys(scale);

      // remove excess keys
      Object.keys(this.proxyScale).filter(function (proxyKey) {
        return !newScaleKeys.includes(proxyKey);
      }).forEach(function (proxyKey) {
        return delete _this.proxyScale[proxyKey];
      });

      // add in needed keys
      newScaleKeys.forEach(function (scaleKey) {
        _this.proxyScale[scaleKey] = function () {
          var _scale;

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var result = (_scale = _this.scale)[scaleKey].apply(_scale, args);

          // if the function returns the scale, return the proxy scale
          if (result === _this.scale) {
            // this implies it was a setter
            _this.dispatch.call(Events.proxySet, _this, scaleKey, args);

            return _this.proxyScale;
          }

          // otherwise return the result
          return result;
        };
      });
    }

    /**
     * Reset to the original scale
     *
     * @return {void}
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.changeScale(this.originalScale, this.originalScaleType);
    }

    /**
     * Reset stats about the scale
     *
     * @return {void}
     */

  }, {
    key: 'statsReset',
    value: function statsReset() {
      this.stats = { domainCounts: {}, rangeCounts: {} };
    }

    /**
     * Record stats each time value is called
     *
     * @param {Any} domainValue The domain value
     * @param {Any} rangeValue The range value the scale produced
     * @return {void}
     */

  }, {
    key: 'statsRecordValueUsed',
    value: function statsRecordValueUsed(domainValue, rangeValue) {
      var _stats = this.stats;
      var domainCounts = _stats.domainCounts;
      var rangeCounts = _stats.rangeCounts;


      if (!domainCounts[domainValue]) {
        domainCounts[domainValue] = 1;
      } else {
        domainCounts[domainValue] += 1;
      }

      if (!rangeCounts[rangeValue]) {
        rangeCounts[rangeValue] = 1;
      } else {
        rangeCounts[rangeValue] += 1;
      }
    }
  }]);
  return ScaleProxy;
}();

ScaleProxy.Events = Events;

// Add in supported scales interface based on the supportedScales array
ScaleProxy.prototype.supportedScales = supportedScales;

// create interface for each d3 scale that is supported.
// this enables d3.scaleInteractive(...).scaleLinear()
supportedScales.forEach(function (scaleFuncName) {
  // e.g. set this.scaleLinear
  ScaleProxy.prototype[scaleFuncName] = function supportedScale() {
    return this.changeScale(d3Scale[scaleFuncName].apply(d3Scale, arguments), scaleFuncName);
  };
});

var cssRootPrefix = 'd3-scale-interactive';

function className(suffix) {
  return '' + cssRootPrefix + (suffix ? '-' + suffix : '');
}

function renderComponent(instance, ComponentClass, parentNode, props) {
  if (!instance) {
    instance = new ComponentClass(parentNode, props);
  } else {
    instance.update(props);
  }

  return instance;
}

var TypeSelector = function () {
  function TypeSelector(parent, props) {
    classCallCheck(this, TypeSelector);

    this.parent = parent;
    this.update(props);
  }

  createClass(TypeSelector, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.render();
    }
  }, {
    key: 'setup',
    value: function setup() {
      var _this = this;

      var that = this;
      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('type-selector'));

      this.select = this.root.append('select').property('selected', this.props.type).on('change', function change() {
        var value = this.value;
        if (value !== 'null') {
          that.props.onChange(value);
        }
      });

      this.select.append('option').property('value', 'null').text('Scale Type');

      supportedScales.forEach(function (scaleFuncName) {
        _this.select.append('option').property('value', scaleFuncName).text(scaleFuncName);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }

      this.select.property('value', this.props.type);
    }
  }]);
  return TypeSelector;
}();

// https://github.com/rollup/rollup/wiki/Troubleshooting#avoiding-eval
var eval2 = eval;

var DomainInput = function () {
  function DomainInput(parent, props) {
    classCallCheck(this, DomainInput);

    this.parent = parent;
    this.update(props);
  }

  createClass(DomainInput, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.render();
    }
  }, {
    key: 'setup',
    value: function setup() {
      var that = this;
      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('domain-input'));

      this.input = this.root.append('input').attr('class', className('input-field')).attr('type', 'text').on('change', function change() {
        var value = eval2(this.value);
        that.props.onChange(value);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }

      this.input.property('value', JSON.stringify(this.props.domain));
    }
  }]);
  return DomainInput;
}();

var ColorBar = function () {
  function ColorBar(parent, props) {
    classCallCheck(this, ColorBar);

    this.parent = parent;
    this.update(props);
  }

  createClass(ColorBar, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.render();
    }
  }, {
    key: 'setup',
    value: function setup() {
      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('color-bar'));
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }

      var colors = this.props.colors;

      var binding = this.root.selectAll('div').data(colors);

      var availableWidth = this.root.node().getBoundingClientRect().width;
      var colorWidth = availableWidth / colors.length;

      // ENTER
      var entering = binding.enter().append('div').attr('class', className('color-bar-box'));

      // ENTER + UPDATE
      binding.merge(entering).style('background-color', function (d) {
        return d;
      }).style('width', colorWidth + 'px');

      // EXIT
      binding.exit().remove();
    }
  }]);
  return ColorBar;
}();

function d3ColorSchemes() {
  var list = ['schemeCategory10', 'schemeCategory20', 'schemeCategory20b', 'schemeCategory20c', 'schemeAccent', 'schemeDark2', 'schemePaired', 'schemePastel1', 'schemePastel2', 'schemeSet1', 'schemeSet2', 'schemeSet3'];

  // filter only those available in case d3-scale-chromatic not there
  return list.filter(function (name) {
    return window.d3[name];
  });
}

var ColorSchemeSelector = function () {
  function ColorSchemeSelector(parent, props) {
    classCallCheck(this, ColorSchemeSelector);

    this.parent = parent;
    this.update(props);
  }

  createClass(ColorSchemeSelector, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.render();
    }
  }, {
    key: 'setup',
    value: function setup() {
      var _this = this;

      var that = this;
      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('color-scheme-selector'));

      this.select = this.root.append('select').property('selected', this.props.scheme).on('change', function change() {
        var value = this.value;
        if (value !== 'null') {
          that.props.onChange(value);
        }
      });

      this.select.append('option').property('value', 'null').text('Color Scheme');

      d3ColorSchemes().forEach(function (scheme) {
        _this.select.append('option').property('value', scheme).text(scheme);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }

      this.select.property('value', this.props.scheme);
    }
  }]);
  return ColorSchemeSelector;
}();

// https://github.com/rollup/rollup/wiki/Troubleshooting#avoiding-eval
var eval2$1 = eval;

var RangeInput = function () {
  function RangeInput(parent, props) {
    classCallCheck(this, RangeInput);

    this.parent = parent;
    this.handleColorSchemeChange = this.handleColorSchemeChange.bind(this);

    this.update(props);
  }

  createClass(RangeInput, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.render();
    }
  }, {
    key: 'setup',
    value: function setup() {
      var that = this;
      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('range-input'));

      this.input = this.root.append('input').attr('class', className('input-field')).attr('type', 'text').on('change', function change() {
        var value = eval2$1(this.value);
        that.props.onChange(value);
      });
    }
  }, {
    key: 'handleColorSchemeChange',
    value: function handleColorSchemeChange(scheme) {
      var newRange = d3Scale[scheme] || d3ScaleChromatic[scheme];
      if (newRange) {
        this.props.onChange(newRange);
      }
    }

    /**
     * Returns true if this range is a bunch of colors
     *
     * @return {Boolean}
     */

  }, {
    key: 'isColorRange',
    value: function isColorRange() {
      var range = this.props.range;

      return d3Color.color(range && range[0]) != null;
    }
  }, {
    key: 'renderColorBar',
    value: function renderColorBar() {
      if (this.isColorRange()) {
        this.colorBar = renderComponent(this.colorBar, ColorBar, this.root.node(), {
          colors: this.props.range
        });
      } else if (this.colorBar) {
        this.colorBar.root.remove();
        this.colorBar = null;
      }
    }
  }, {
    key: 'renderColorSchemeSelector',
    value: function renderColorSchemeSelector() {
      if (this.isColorRange()) {
        this.colorSchemeSelector = renderComponent(this.colorSchemeSelector, ColorSchemeSelector, this.root.node(), {
          scheme: null,
          onChange: this.handleColorSchemeChange
        });
      } else if (this.colorSchemeSelector) {
        this.colorSchemeSelector.root.remove();
        this.colorSchemeSelector = null;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var range = this.props.range;


      if (!this.root) {
        this.setup();
      }

      this.input.property('value', JSON.stringify(range));

      this.renderColorBar();
      this.renderColorSchemeSelector();
    }
  }]);
  return RangeInput;
}();

function d3Interpolators() {
  var list = ['interpolateViridis', 'interpolateInferno', 'interpolateMagma', 'interpolatePlasma', 'interpolateWarm', 'interpolateCool', 'interpolateRainbow', 'interpolateCubehelixDefault', 'interpolateBrBG', 'interpolatePRGn', 'interpolatePiYG', 'interpolatePuOr', 'interpolateRdBu', 'interpolateRdGy', 'interpolateRdYlBu', 'interpolateRdYlGn', 'interpolateSpectral', 'interpolateBlues', 'interpolateGreens', 'interpolateGreys', 'interpolateOranges', 'interpolatePurples', 'interpolateReds', 'interpolateBuGn', 'interpolateBuPu', 'interpolateGnBu', 'interpolateOrRd', 'interpolatePuBuGn', 'interpolatePuBu', 'interpolatePuRd', 'interpolateRdPu', 'interpolateYlGnBu', 'interpolateYlGn', 'interpolateYlOrBr', 'interpolateYlOrRd'];

  // filter only those available in case d3-scale-chromatic not there
  return list.filter(function (name) {
    return window.d3[name];
  });
}

var InterpolatorSelector = function () {
  function InterpolatorSelector(parent, props) {
    classCallCheck(this, InterpolatorSelector);

    this.parent = parent;
    this.update(props);
  }

  createClass(InterpolatorSelector, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.render();
    }
  }, {
    key: 'setup',
    value: function setup() {
      var _this = this;

      var that = this;
      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('interpolator-selector'));

      this.select = this.root.append('select').property('selected', this.props.interpolator).on('change', function change() {
        var value = this.value;
        if (value !== 'null') {
          that.props.onChange(value);
        }
      });

      this.select.append('option').property('value', 'null').text('Interpolator');

      d3Interpolators().forEach(function (interpolator) {
        _this.select.append('option').property('value', interpolator).text(interpolator);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }

      this.select.property('value', this.props.interpolator);
    }
  }]);
  return InterpolatorSelector;
}();

var InterpolatorInput = function () {
  function InterpolatorInput(parent, props) {
    classCallCheck(this, InterpolatorInput);

    this.parent = parent;
    this.handleInterpolatorChange = this.handleInterpolatorChange.bind(this);

    this.update(props);
  }

  createClass(InterpolatorInput, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.render();
    }
  }, {
    key: 'setup',
    value: function setup() {
      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('interpolator-input'));
    }
  }, {
    key: 'handleInterpolatorChange',
    value: function handleInterpolatorChange(interpolator) {
      var newInterpolator = d3Scale[interpolator] || d3ScaleChromatic[interpolator];
      if (newInterpolator) {
        this.props.onChange(newInterpolator);
      }
    }
  }, {
    key: 'renderColorBar',
    value: function renderColorBar() {
      var _this = this;

      var interpolatorColors = d3Array.range(0, 1, 0.01).map(function (t) {
        return _this.props.interpolator(t);
      });
      this.colorBar = renderComponent(this.colorBar, ColorBar, this.root.node(), {
        colors: interpolatorColors
      });
    }
  }, {
    key: 'renderInterpolatorSelector',
    value: function renderInterpolatorSelector() {
      this.interpolatorSelector = renderComponent(this.interpolatorSelector, InterpolatorSelector, this.root.node(), {
        interpolator: null,
        onChange: this.handleInterpolatorChange
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }

      this.renderColorBar();
      this.renderInterpolatorSelector();
    }
  }]);
  return InterpolatorInput;
}();

var ScalePanel = function () {
  function ScalePanel(parent, props) {
    var _this = this;

    classCallCheck(this, ScalePanel);

    this.parent = parent;
    this.scaleProxy = props.scaleProxy;

    // bind handlers
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleScalePropertyChange = this.handleScalePropertyChange.bind(this);
    this.handleDomainChange = this.handleScalePropertyChange.bind(this, 'domain');
    this.handleRangeChange = this.handleScalePropertyChange.bind(this, 'range');
    this.handleInterpolatorChange = this.handleScalePropertyChange.bind(this, 'interpolator');

    this.renderTypeSelector = this.renderTypeSelector.bind(this);
    this.renderDomainInput = this.renderDomainInput.bind(this);
    this.renderRangeInput = this.renderRangeInput.bind(this);
    this.renderInterpolatorInput = this.renderInterpolatorInput.bind(this);

    // attach listeners
    this.scaleProxy.on('update.scale-panel', function () {
      return _this.render();
    });
    // note that we need proxy-set to catch any set up the user does
    // e.g. calling .domain([min, max]).
    this.scaleProxy.on('proxy-set.scale-panel', function () {
      return _this.render();
    });
    this.render();
  }

  createClass(ScalePanel, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.scaleProxy = nextProps.scaleProxy;

      this.render();
    }
  }, {
    key: 'setup',
    value: function setup() {
      var _this2 = this;

      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('panel'));

      this.reset = this.root.append('span').attr('class', className('reset-button')).text('Reset').on('click', function () {
        return _this2.scaleProxy.reset();
      });

      this.header = this.root.append('h3').attr('class', className('panel-header'));

      this.inner = this.root.append('div').attr('class', className('panel-inner'));

      this.itemsContainer = this.inner.append('div').attr('class', className('panel-items'));

      this.items = {};
    }
  }, {
    key: 'handleTypeChange',
    value: function handleTypeChange(newType) {
      this.scaleProxy.changeScaleType(newType);
    }
  }, {
    key: 'handleScalePropertyChange',
    value: function handleScalePropertyChange(property, value) {
      this.scaleProxy.changeScaleProperty(property, value);
    }
  }, {
    key: 'renderDomainInput',
    value: function renderDomainInput(parentNode) {
      this.domainInput = renderComponent(this.domainInput, DomainInput, parentNode, {
        domain: this.scaleProxy.proxyScale.domain(),
        onChange: this.handleDomainChange
      });
    }
  }, {
    key: 'renderRangeInput',
    value: function renderRangeInput(parentNode) {
      this.rangeInput = renderComponent(this.rangeInput, RangeInput, parentNode, {
        range: this.scaleProxy.proxyScale.range(),
        onChange: this.handleRangeChange
      });
    }
  }, {
    key: 'renderInterpolatorInput',
    value: function renderInterpolatorInput(parentNode) {
      this.interpolatorInput = renderComponent(this.interpolatorInput, InterpolatorInput, parentNode, {
        interpolator: this.scaleProxy.proxyScale.interpolator(),
        onChange: this.handleInterpolatorChange
      });
    }
  }, {
    key: 'renderTypeSelector',
    value: function renderTypeSelector(parentNode) {
      this.typeSelector = renderComponent(this.typeSelector, TypeSelector, parentNode, {
        type: this.scaleProxy.scaleType,
        onChange: this.handleTypeChange
      });
    }

    /**
     * Render the items that show up in the panel to edit
     * e.g., Type, Domain, Range, Interpolator
     */

  }, {
    key: 'renderItems',
    value: function renderItems() {
      this.renderItem('Type', this.renderTypeSelector);
      this.renderItem('Domain', this.renderDomainInput, 'domain', 'domainInput');
      this.renderItem('Range', this.renderRangeInput, 'range', 'rangeInput');
      this.renderItem('Interpolator', this.renderInterpolatorInput, 'interpolator', 'interpolatorInput');
    }
  }, {
    key: 'renderItem',
    value: function renderItem(label, _renderItem, scaleProp, stateKey) {
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

      var item = this.items[label];
      if (!item) {
        item = this.itemsContainer.append('div').attr('class', className('panel-item'));
        this.items[label] = item;

        item.append('h4').text(label);
        item.append('div').attr('class', className('panel-item-inner'));
      }

      var inner = item.select('.' + className('panel-item-inner'));
      _renderItem(inner.node());
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }

      this.header.text(this.scaleProxy.name);
      this.renderItems();
    }
  }]);
  return ScalePanel;
}();

var MainContainer = function () {
  function MainContainer(parent, props) {
    classCallCheck(this, MainContainer);

    this.parent = parent;
    this.visible = true;

    this.scaleProxies = [];
    this.panels = [];

    this.toggleView = this.toggleView.bind(this);

    this.update(props);
  }

  createClass(MainContainer, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.render();
    }
  }, {
    key: 'addScale',
    value: function addScale(scaleProxy) {
      this.scaleProxies.push(scaleProxy);
      this.render();
    }
  }, {
    key: 'setup',
    value: function setup() {
      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('main')).datum(this);

      this.inner = this.root.append('div').attr('class', className('main-inner'));

      this.toggle = this.root.append('div').attr('class', className('main-toggle')).on('click', this.toggleView);
    }
  }, {
    key: 'toggleView',
    value: function toggleView() {
      this.visible = !this.visible;
      this.render();
    }
  }, {
    key: 'renderScales',
    value: function renderScales() {
      var _this = this;

      this.scaleProxies.forEach(function (scaleProxy, i) {
        _this.panels[i] = renderComponent(_this.panels[i], ScalePanel, _this.inner.node(), {
          scaleProxy: scaleProxy
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }

      this.root.classed(className('visible'), this.visible);
      this.root.classed(className('hidden'), !this.visible);
      this.toggle.text(this.visible ? 'Hide scales' : 'Show d3-scale-interactive');

      this.renderScales();
    }
  }]);
  return MainContainer;
}();

/**
 * Make a scale interactive.
 *
 * Typical usage:
 * ```
 * color = d3.scaleSequential(d3.interpolateMagma)
 *   .domain(d3.extent(data, d => d.v));
 * ```
 *
 * Becomes:
 * ```
 * color = d3.scaleInteractive('color', updateChart)
 *   .scaleSequential(d3.interpolateMagma)
 *   .domain(d3.extent(data, d => d.v));
 * ```
 *
 * @param {String} name The name of the scale
 * @param {Function} update The function to call to redraw a chart
 * @return {Object} The instantiated ScaleProxy object. call `.scale[Type]`
 *   to get typical behavior.
 */
function scaleInteractive(name, update) {
  var scaleProxy = new ScaleProxy(name);

  // create a new container if necessary, otherwise add to existing
  var main = d3Selection.select('.' + className('main'));
  var mainContainer = void 0;
  if (main.empty()) {
    mainContainer = new MainContainer(document.body);
  } else {
    mainContainer = main.datum();
  }

  mainContainer.addScale(scaleProxy);

  // wait until next tick before listening for chart updates to ensure chart gets
  // set up properly. Otherwise, this calls `update` right after d3.scaleInteractive()
  // and the rest of the scale hasn't even been defined yet.
  setTimeout(function () {
    scaleProxy.saveAsOriginalScale();
    scaleProxy.on('update.chart', function () {
      update();
    });
  }, 0);

  return scaleProxy;
}

exports.scaleInteractive = scaleInteractive;

Object.defineProperty(exports, '__esModule', { value: true });

})));