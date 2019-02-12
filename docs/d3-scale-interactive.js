(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('d3-dispatch'), require('d3-array'), require('d3-scale'), require('d3-scale-chromatic'), require('d3-interpolate'), require('d3-color'), require('d3-axis')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-dispatch', 'd3-array', 'd3-scale', 'd3-scale-chromatic', 'd3-interpolate', 'd3-color', 'd3-axis'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3,global.d3,global.d3,global.d3,global.d3,global.d3));
}(this, (function (exports,d3Selection,d3Dispatch,d3Array,d3Scale,d3ScaleChromatic,d3Interpolate,d3Color,d3Axis) { 'use strict';

var supportedScales = ['scaleSequential', 'scaleOrdinal', 'scaleBand', 'scalePoint', 'scaleLinear', 'scaleLog', 'scalePow', 'scaleTime', 'scaleUtc', 'scaleQuantize', 'scaleQuantile', 'scaleThreshold'];

var ignoreKeysOnRead = ['bandwidth', 'copy', 'invert', 'nice', 'quantiles', 'rangeRound', 'step', 'ticks', 'tickFormat'];

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

var scaleKeys = Object.keys(d3Scale).concat(Object.keys(d3ScaleChromatic));

/**
 * Function that lists available interpolators
 */
function d3ColorInterpolators() {
  var list = ['interpolateViridis', 'interpolateInferno', 'interpolateMagma', 'interpolatePlasma', 'interpolateWarm', 'interpolateCool', 'interpolateRainbow', 'interpolateCubehelixDefault', 'interpolateBrBG', 'interpolatePRGn', 'interpolatePiYG', 'interpolatePuOr', 'interpolateRdBu', 'interpolateRdGy', 'interpolateRdYlBu', 'interpolateRdYlGn', 'interpolateSpectral', 'interpolateBlues', 'interpolateGreens', 'interpolateGreys', 'interpolateOranges', 'interpolatePurples', 'interpolateReds', 'interpolateBuGn', 'interpolateBuPu', 'interpolateGnBu', 'interpolateOrRd', 'interpolatePuBuGn', 'interpolatePuBu', 'interpolatePuRd', 'interpolateRdPu', 'interpolateYlGnBu', 'interpolateYlGn', 'interpolateYlOrBr', 'interpolateYlOrRd'];

  // filter only those available in case d3-scale-chromatic not there
  return list.filter(function (name) {
    return scaleKeys.includes(name);
  });
}

/**
 * Takes an color interpolator function and returns its string name
 * @param {Function} interpolator e.g. d3.interpolateWarm
 * @return {String} The name e.g. "interpolateWarm"
 */
function asString(interpolator) {
  var list = d3ColorInterpolators();
  for (var i = 0; i < list.length; i++) {
    if (d3Scale[list[i]] === interpolator || d3ScaleChromatic[list[i]] === interpolator) {
      return list[i];
    }
  }

  return undefined;
}

var list = ['interpolate', 'interpolateNumber', 'interpolateRound', 'interpolateString', 'interpolateDate', 'interpolateArray', 'interpolateObject', 'interpolateRgb', 'interpolateHsl', 'interpolateHslLong', 'interpolateLab', 'interpolateHcl', 'interpolateHclLong', 'interpolateCubehelix', 'interpolateCubehelixLong'];

/**
 * Function that lists available interpolators from d3-interpolate
 * Use a function just to match the other ones (e.g. d3ColorInterpolators)
 */
function d3Interpolators() {
  return list;
}

/**
 * Takes an interpolator function and returns its string name
 * @param {Function} interpolator e.g. d3.interpolateNumber
 * @return {String} The name e.g. "interpolateNumber"
 */
function asString$1(interpolator) {
  for (var i = 0; i < list.length; i++) {
    if (d3Interpolate[list[i]] === interpolator) {
      return list[i];
    }
  }

  return undefined;
}

var scaleKeys$1 = Object.keys(d3Scale).concat(Object.keys(d3ScaleChromatic));

/**
 * Function that lists available color schemes
 */
function d3ColorSchemes() {
  var list = ['schemeCategory10', 'schemeCategory20', 'schemeCategory20b', 'schemeCategory20c', 'schemeAccent', 'schemeDark2', 'schemePaired', 'schemePastel1', 'schemePastel2', 'schemeSet1', 'schemeSet2', 'schemeSet3'];

  // filter only those available in case d3-scale-chromatic not there
  return list.filter(function (name) {
    return scaleKeys$1.includes(name);
  });
}

/**
 * Takes an color scheme function and returns its string name
 * @param {Function} scheme e.g. d3.schemeAccent
 * @return {String} The name e.g. "schemeAccent"
 */
function asString$2(scheme) {
  var list = d3ColorSchemes();

  // lazy shallow equals with stringify
  var schemeString = JSON.stringify(scheme);

  for (var i = 0; i < list.length; i++) {
    if (JSON.stringify(d3Scale[list[i]]) === schemeString || JSON.stringify(d3ScaleChromatic[list[i]]) === schemeString) {
      return list[i];
    }
  }

  return undefined;
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

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

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

// list of continuous scales
var continuousScales = ['scaleLinear', 'scalePow', 'scaleLog', 'scaleTime', 'scaleUtc', 'scaleIdentity'];
var ordinalScales = ['scaleOrdinal', 'scalePoint', 'scaleBand'];
var timeScales = ['scaleTime', 'scaleUtc'];

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

    this.fakedKeys = {};
    this.pinned = false;
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
  }, {
    key: 'isContinuous',
    value: function isContinuous() {
      return continuousScales.includes(this.scaleType);
    }
  }, {
    key: 'isOrdinal',
    value: function isOrdinal() {
      return ordinalScales.includes(this.scaleType);
    }
  }, {
    key: 'isTimeScale',
    value: function isTimeScale() {
      return timeScales.includes(this.scaleType);
    }
  }, {
    key: 'pin',
    value: function pin() {
      this.pinned = true;
    }
  }, {
    key: 'unpin',
    value: function unpin() {
      this.pinned = false;
    }

    /**
     * Generate the js code to create this scale from scratch
     */

  }, {
    key: 'generateCode',
    value: function generateCode() {
      var _this = this;

      var ignoreKeys = ['bandwidth', 'copy', 'interpolate', 'interpolator', 'invert', 'nice', 'quantiles', 'range', 'rangeRound', 'step', 'ticks', 'tickFormat'];

      var newDefault = d3Scale[this.scaleType]();

      // helper to get prettier stringified values
      function stringifyValue(value) {
        if (Array.isArray(value)) {
          // get spaces after commas in arrays
          return '[' + value.map(function (v) {
            return JSON.stringify(v);
          }).join(', ') + ']';
        }
        return JSON.stringify(value);
      }

      var settings = Object.keys(this.scale).filter(function (key) {
        return !ignoreKeys.includes(key);
      }).map(function (key) {
        return { key: key, value: _this.scale[key]() };
      })
      // filter out values that are the default
      .filter(function (_ref) {
        var key = _ref.key;
        var value = _ref.value;
        return newDefault[key]() != value;
      }) // eslint-disable-line
      .map(function (_ref2) {
        var key = _ref2.key;
        var value = _ref2.value;
        return { key: key, value: stringifyValue(value) };
      });

      // match the color interpolator name
      if (this.scale.interpolator) {
        var interpolator = this.scale.interpolator();

        // if different from default
        if (newDefault.interpolator() !== interpolator) {
          var interpolatorString = asString(interpolator);
          if (interpolatorString) {
            settings.push({ key: 'interpolator', value: 'd3.' + interpolatorString });
          }
        }
      }

      // match the interpolator name for .interpolate
      if (this.scale.interpolate) {
        var interpolate = this.scale.interpolate();

        // if different from default
        if (newDefault.interpolate() !== interpolate) {
          var _interpolatorString = asString$1(interpolate);
          if (_interpolatorString) {
            settings.push({ key: 'interpolate', value: 'd3.' + _interpolatorString });
          }
        }
      }

      // match a color scheme
      if (this.scale.range) {
        var range = JSON.stringify(this.scale.range());
        var rangeSetting = asString$2(range);
        if (rangeSetting) {
          settings.push({ key: 'range', value: 'd3.' + rangeSetting });
        } else {
          rangeSetting = { key: 'range', value: stringifyValue(this.scale.range()) };
        }

        // insert setting at 2nd spot, since first is typically domain in Object.keys(scale)
        settings = [settings[0], rangeSetting].concat(toConsumableArray(settings.slice(1)));
      }

      return 'd3.' + this.scaleType + '()' + settings.map(function (_ref3) {
        var key = _ref3.key;
        var value = _ref3.value;
        return '\n  .' + key + '(' + value + ')';
      }).join('') + ';';
    }

    /**
     * Changes the active scale and returns the proxy scale.
     *
     * @param {Function} scale The new active scale to set (e.g. d3.scaleLinear())
     * @param {String} [scaleType] A key for identifying the type of scale being set
     * @param {Boolean} [fromUser=false] Scale change came from d3.scaleInteractive().scaleLinear() or equivalent.
     *   Can be used to skip update and be ignored if pinned.
     *
     * @return {Function} the proxy scale
     */

  }, {
    key: 'changeScale',
    value: function changeScale(scale, scaleType, fromUser) {
      var _this2 = this;

      if (fromUser && this.pinned) {
        this.statsReset();
        // add in no-ops for this type of scale
        this.fakeMissingScaleFunctions(scale);

        return this.proxyScale;
      }

      // handle special conversions
      if (this.scaleType === 'scaleSequential') {
        // sequential doesn't have a range, so take the ends of the domain to initialize our range
        if (scale.range) {
          var domain = this.scale.domain();
          scale.range(domain.map(function (d) {
            return _this2.scale(d);
          }));
        }
      } else if (this.scaleType === 'scaleOrdinal') {
        // map the domain to the extent so we don't get a hundred entries
        scale.domain(d3Array.extent(this.scale.domain()));
      }

      this.scaleType = scaleType;
      this.scale = scale;
      this.updateProxyScaleFunctions(scale);
      this.statsReset();

      if (!fromUser) {
        this.update();
      }

      return this.proxyScale;
    }

    /**
     * Once the initial scale has been set up, save it with this function
     * to get reset working properly.
     */

  }, {
    key: 'saveOriginalScale',
    value: function saveOriginalScale() {
      var scale = arguments.length <= 0 || arguments[0] === undefined ? this.scale : arguments[0];
      var scaleType = arguments.length <= 1 || arguments[1] === undefined ? this.scaleType : arguments[1];

      this.originalScale = scale.copy();
      this.originalScaleType = scaleType;
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
      if (this.originalScale === null) {
        this.saveOriginalScale();
      }

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
      if (this.originalScale === null) {
        this.saveOriginalScale();
      }

      this.scale[property](value);
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
      var _this3 = this;

      var newScaleKeys = Object.keys(scale);

      // clear faked keys list
      this.fakedKeys = {};

      // remove excess keys
      Object.keys(this.proxyScale).filter(function (proxyKey) {
        return !newScaleKeys.includes(proxyKey);
      }).forEach(function (proxyKey) {
        return delete _this3.proxyScale[proxyKey];
      });

      // add in needed keys
      newScaleKeys.forEach(function (scaleKey) {
        _this3.proxyScale[scaleKey] = function () {
          var _scale;

          // check for pinned and a setter -- if so, ignore the setter
          if (_this3.pinned) {
            if (arguments.length || scaleKey === 'nice') {
              return _this3.proxyScale;
            }
          }

          var result = (_scale = _this3.scale)[scaleKey].apply(_scale, arguments);

          // if the function returns the scale, return the proxy scale
          if (result === _this3.scale) {
            // this implies it was a setter
            _this3.dispatch.call(Events.proxySet);

            return _this3.proxyScale;
          }

          // otherwise return the result
          return result;
        };
      });
    }

    /**
     * Fake having functions from the scale to prevent errors in user code
     * when we skip switching to the specified scale type due to being pinned.
     * Not perfect, but hopefully helps in a few cases.
     *
     * @param {Function} scale (e.g. d3.scaleLinear())
     */

  }, {
    key: 'fakeMissingScaleFunctions',
    value: function fakeMissingScaleFunctions(scale) {
      var _this4 = this;

      var proxyKeys = Object.keys(this.proxyScale);

      // find the ones we do not currently have
      var missingKeys = Object.keys(scale).filter(function (newScaleKey) {
        return !proxyKeys.includes(newScaleKey);
      });

      // add in missing keys
      missingKeys.forEach(function (scaleKey) {
        _this4.proxyScale[scaleKey] = function () {
          if (arguments.length || scaleKey === 'nice') {
            return _this4.proxyScale;
          }

          // otherwise return an empty object... hopefully this mutes enough errors.
          return {};
        };
      });

      this.fakedKeys = missingKeys.reduce(function (faked, key) {
        faked[key] = true;
        return faked;
      }, {});
    }

    /**
     * Reset to the original scale
     *
     * @return {void}
     */

  }, {
    key: 'reset',
    value: function reset() {
      // be sure to create a copy so we do not modify the original scale for future resets
      if (this.originalScale) {
        this.changeScale(this.originalScale.copy(), this.originalScaleType);
      }
    }

    /**
     * Reset stats about the scale
     *
     * @return {void}
     */

  }, {
    key: 'statsReset',
    value: function statsReset() {
      this.stats = { domainCounts: {}, domainHistogram: [], rangeCounts: {}, rangeHistogram: [] };
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
      var domainHistogram = _stats.domainHistogram;
      var rangeHistogram = _stats.rangeHistogram;


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

      domainHistogram.push(domainValue);
      rangeHistogram.push(rangeValue);

      this.debouncedProxySet();
    }
  }, {
    key: 'debouncedProxySet',
    value: function debouncedProxySet() {
      var _this5 = this;

      var now = Date.now();
      var debounceThreshold = 500;
      // enough time has passed, call proxy set
      if (this.lastProxySetAttempt && now - this.lastProxySetAttempt > debounceThreshold) {
        clearTimeout(this.proxySetTimeout);
        this.proxySetTimeout = null;
        this.lastProxySetAttempt = null;

        // proxy set
        this.dispatch.call(Events.proxySet, this);

        // not enough time has passed - reset the timer
      } else {
        this.lastProxySetAttempt = now;
        clearTimeout(this.proxySetTimeout);
        this.proxySetTimeout = setTimeout(function () {
          return _this5.debouncedProxySet();
        }, debounceThreshold);
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
    return this.changeScale(d3Scale[scaleFuncName].apply(d3Scale, arguments), scaleFuncName, true);
  };
});

var cssRootPrefix = 'd3-scale-interactive';

function className(suffix) {
  return '' + cssRootPrefix + (suffix ? '-' + suffix : '');
}

function renderComponent(instance, ComponentClass, parentNode, props) {
  // if it doesn't match the component class we are trying to make, destroy
  if (instance && !(instance instanceof ComponentClass)) {
    // destroy
    instance.root.remove();
    instance = null;
  }
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

      this.docsLink = this.root.append('a').attr('target', '_blank').text('docs');
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }

      var type = this.props.type;


      this.docsLink.attr('href', 'https://github.com/d3/d3-scale#' + type);
      this.select.property('value', this.props.type);
    }
  }]);
  return TypeSelector;
}();

/**
 * Get a color as #rrggbb for input type='color'
 */
function colorString(value) {
  var asColor = d3Color.color(value);
  var r = asColor.r.toString(16);
  var g = asColor.g.toString(16);
  var b = asColor.b.toString(16);

  return '#' + (r.length === 1 ? '0' : '') + r + (g.length === 1 ? '0' : '') + g + (b.length === 1 ? '0' : '') + b;
}

/**
 * Helper that returns true if the value is a color
 */
function isColor(value) {
  return value && d3Color.color(value) != null;
}

var ArrayInput = function () {
  function ArrayInput(parent, props) {
    classCallCheck(this, ArrayInput);

    this.parent = parent;
    this.update(props);

    this.addEntry = this.addEntry.bind(this);
    this.removeEntry = this.removeEntry.bind(this);
  }

  createClass(ArrayInput, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.render();
    }
  }, {
    key: 'setup',
    value: function setup() {
      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('array-input'));

      this.entries = [];
    }

    /**
     * Callback for when an input field is modified
     */

  }, {
    key: 'inputChange',
    value: function inputChange(target) {
      var index = parseInt(target.parentNode.getAttribute('data-index'), 10);
      var _props = this.props;
      var values = _props.values;
      var onChange = _props.onChange;

      var oldValues = values;

      // try to convert it to a number
      var newValue = target.value;
      var oldValue = values[index];
      if (oldValue instanceof Date) {
        var _newValue$split = newValue.split('-');

        var _newValue$split2 = slicedToArray(_newValue$split, 3);

        var year = _newValue$split2[0];
        var month = _newValue$split2[1];
        var day = _newValue$split2[2];

        newValue = new Date(year, month - 1, day);
      } else if (!isNaN(parseFloat(newValue))) {
        newValue = parseFloat(newValue);
      }

      var newValues = [].concat(toConsumableArray(oldValues.slice(0, index)), [newValue], toConsumableArray(oldValues.slice(index + 1)));
      onChange(newValues);
    }

    /**
     * Callback for when a new entry should be added
     */

  }, {
    key: 'addEntry',
    value: function addEntry(target) {
      var index = parseInt(target.parentNode.getAttribute('data-index'), 10);

      var _props2 = this.props;
      var values = _props2.values;
      var onChange = _props2.onChange;

      var oldValues = values;

      // attempt interpolation between the this and the next otherwise use this value
      var curr = oldValues[index];
      var next = oldValues[index + 1] == null ? curr : oldValues[index + 1];

      var newValue = d3Interpolate.interpolate(curr, next)(0.5);
      if (isColor(newValue)) {
        newValue = colorString(newValue);
      }

      var newValues = [].concat(toConsumableArray(oldValues.slice(0, index + 1)), [newValue], toConsumableArray(oldValues.slice(index + 1)));
      onChange(newValues);
    }

    /**
     * Callback for when an entry should be removed.
     */

  }, {
    key: 'removeEntry',
    value: function removeEntry(target) {
      var index = parseInt(target.parentNode.getAttribute('data-index'), 10);

      var _props3 = this.props;
      var values = _props3.values;
      var onChange = _props3.onChange;

      var oldValues = values;
      var newValues = [].concat(toConsumableArray(oldValues.slice(0, index)), toConsumableArray(oldValues.slice(index + 1)));
      onChange(newValues);
    }
  }, {
    key: 'startDrag',
    value: function startDrag(target) {
      var index = parseInt(target.parentNode.getAttribute('data-index'), 10);
      var values = this.props.values;

      this.dragging = target;
      this.dragStartY = d3Selection.event.clientY;
      this.dragStartValue = values[index];
    }
  }, {
    key: 'drag',
    value: function drag(target) {
      var index = parseInt(target.parentNode.getAttribute('data-index'), 10);
      var _props4 = this.props;
      var values = _props4.values;
      var onChange = _props4.onChange;


      var delta = d3Selection.event.clientY - this.dragStartY;

      // a minimum of 8 pixels of mousemovement to start a drag
      if (Math.abs(delta) < 8) {
        return;
      }

      var oldValues = values;
      var increment = Math.abs(this.dragStartValue * 0.01);

      // if it is an integer, minimum increment is 1
      var isInteger = false;
      if (this.dragStartValue === Math.round(this.dragStartValue)) {
        isInteger = true;
        increment = Math.max(1, Math.round(increment));
      }

      var newValue = this.dragStartValue + increment * -delta;

      // roughly get 2 decimal places if not an integer
      if (!isInteger) {
        newValue = Math.round(newValue * 100) / 100;
      }

      var newValues = [].concat(toConsumableArray(oldValues.slice(0, index)), [newValue], toConsumableArray(oldValues.slice(index + 1)));
      onChange(newValues);
    }
  }, {
    key: 'endDrag',
    value: function endDrag() {
      this.dragging = undefined;
      this.dragStartY = undefined;
      this.dragStartValue = undefined;
    }
  }, {
    key: 'renderEntry',
    value: function renderEntry(entry, index, removable, addable) {
      var _this = this;

      var root = this.entries[index];

      if (!root) {
        (function () {
          var that = _this;
          root = _this.entries[index] = _this.root.append('div').attr('class', className('input-entry'));

          root.append('input').attr('class', className('input-entry-field')).attr('type', 'date').on('change', function inputChange() {
            that.inputChange(this);
          }).on('mousedown', function mousedown() {
            var target = this;
            var index = parseInt(target.parentNode.getAttribute('data-index'), 10);

            // if not a number, disable dragging
            if (typeof that.props.values[index] !== 'number') {
              return;
            }

            that.startDrag(target);
            d3Selection.select(window).on('mousemove.arrayinput', function () {
              that.drag(target);
            }).on('mouseup.arrayinput', function () {
              that.endDrag(target);
              d3Selection.select(window).on('mouseup.arrayinput', null).on('mousemove.arrayinput', null);
            });
          });

          root.append('span').attr('class', className('input-entry-add')).text('+').on('click', function addClick() {
            that.addEntry(this);
          });
          root.append('span').attr('class', className('input-entry-remove')).text('×').on('click', function removeClick() {
            that.removeEntry(this);
          });

          root.append('input').attr('class', className('input-entry-color')).attr('type', 'color').on('change', function colorChange() {
            that.inputChange(this);
          });
        })();
      }

      root.select('.' + className('input-entry-remove')).style('display', removable ? '' : 'none');

      root.select('.' + className('input-entry-add')).style('display', addable ? '' : 'none');

      root.attr('data-index', index);
      root.select('.' + className('input-entry-color')).classed(className('hidden'), true);

      // handle if date
      if (entry instanceof Date) {
        var year = entry.getFullYear();
        var month = ('0' + (entry.getMonth() + 1)).slice(-2);
        var day = ('0' + entry.getDate()).slice(-2);
        root.select('input').attr('type', 'date').classed(className('draggable'), false).property('value', year + '-' + month + '-' + day);

        // handle if color
      } else if (isColor(entry)) {
        root.select('input').attr('type', 'text').classed(className('draggable'), false).property('value', entry);

        root.select('.' + className('input-entry-color')).property('value', colorString(entry)).classed(className('hidden'), false);
      } else {
        root.select('input').attr('type', 'text').classed(className('draggable'), true).property('value', entry);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (!this.root) {
        this.setup();
      }

      var _props5 = this.props;
      var values = _props5.values;
      var minLength = _props5.minLength;
      var maxLength = _props5.maxLength;

      var removable = values.length > minLength;
      var addable = maxLength === undefined || values.length < maxLength;
      values.forEach(function (entry, i) {
        _this2.renderEntry(entry, i, removable, addable);
      });

      // remove any excess entries
      this.entries.filter(function (entry, i) {
        return i >= values.length;
      }).forEach(function (entry) {
        return entry.remove();
      });
      this.entries = this.entries.slice(0, values.length);
    }
  }]);
  return ArrayInput;
}();

var DomainInput = function () {
  function DomainInput(parent, props) {
    classCallCheck(this, DomainInput);

    this.parent = parent;
    this.update(props);

    this.handleMatchRange = this.handleMatchRange.bind(this);
  }

  createClass(DomainInput, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.render();
    }

    // match the length including the end points

  }, {
    key: 'handleMatchRange',
    value: function handleMatchRange() {
      var _props = this.props;
      var domain = _props.domain;
      var range = _props.range;
      var onChange = _props.onChange;

      var domainMin = domain[0];
      var domainMax = domain[domain.length - 1];
      var step = Math.round(1000 * ((domainMax - domainMin) / (range.length - 1))) / 1000;
      var matched = d3Array.range(domainMin, domainMax, step).concat(domainMax);
      onChange(matched);
    }
  }, {
    key: 'setup',
    value: function setup() {
      var _this = this;

      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('domain-input'));

      this.inner = this.root.append('div');

      this.controls = this.root.append('div').attr('class', className('domain-controls'));

      this.matchRange = this.controls.append('button').text('Match Range Length').on('click', function () {
        return _this.handleMatchRange();
      });

      this.controls.append('button').text('Nice').on('click', this.props.onNice);
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }

      var _props2 = this.props;
      var domain = _props2.domain;
      var onChange = _props2.onChange;
      var range = _props2.range;
      var maxLength = _props2.maxLength;


      this.matchRange.style('display', range ? '' : 'none');

      this.arrayInput = renderComponent(this.arrayInput, ArrayInput, this.inner.node(), {
        values: domain,
        minLength: 2,
        maxLength: maxLength,
        onChange: onChange
      });
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

      var availableWidth = 240;
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

      this.select.property('value', asString$2(this.props.scheme));
    }
  }]);
  return ColorSchemeSelector;
}();

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
      var _this = this;

      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('range-input'));

      this.inner = this.root.append('div');

      this.controls = this.root.append('div').attr('class', className('domain-controls'));

      this.matchDomain = this.controls.append('button').text('Match Domain Length').on('click', function () {
        return _this.handleMatchDomain();
      });
    }

    // match the length including the end points (note that range isn't always numbers)

  }, {
    key: 'handleMatchDomain',
    value: function handleMatchDomain() {
      var _props = this.props;
      var domain = _props.domain;
      var range = _props.range;
      var onChange = _props.onChange;


      if (domain.length === range.length) {
        return;
      }

      var rangeMin = range[0];
      var rangeMax = range[range.length - 1];
      var step = Math.round(1000 * ((rangeMax - rangeMin) / (domain.length - 1))) / 1000;

      var matched = void 0;
      // non-number solution - just copy the last element or truncate the array
      if (isNaN(step)) {
        var numToAdd = domain.length - range.length;
        if (numToAdd > 0) {
          // adding elements
          matched = [].concat(toConsumableArray(range), toConsumableArray(d3Array.range(numToAdd).map(function () {
            return range[range.length - 1];
          })));
        } else {
          // removing elements
          matched = range.slice(0, domain.length);
        }
      } else {
        matched = d3Array.range(rangeMin, rangeMax, step).concat(rangeMax);
      }

      onChange(matched);
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
      var _props2 = this.props;
      var continuous = _props2.continuous;
      var domain = _props2.domain;
      var range = _props2.range;
      var scale = _props2.scale;


      if (this.isColorRange()) {
        var colors = range;
        // if a continuous scale, interpolate the color bar
        if (continuous) {
          var domainMin = domain[0];
          var domainMax = domain[domain.length - 1];
          colors = d3Array.range(domainMin, domainMax, (domainMax - domainMin) / 100).map(function (d) {
            return scale(d);
          });
        }

        this.colorBar = renderComponent(this.colorBar, ColorBar, this.inner.node(), {
          colors: colors
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
        this.colorSchemeSelector = renderComponent(this.colorSchemeSelector, ColorSchemeSelector, this.inner.node(), {
          scheme: this.props.range,
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
      var _props3 = this.props;
      var range = _props3.range;
      var onChange = _props3.onChange;


      if (!this.root) {
        this.setup();
      }

      this.arrayInput = renderComponent(this.arrayInput, ArrayInput, this.inner.node(), {
        values: range,
        minLength: 2,
        onChange: onChange
      });

      this.renderColorBar();
      this.renderColorSchemeSelector();
    }
  }]);
  return RangeInput;
}();

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

      d3ColorInterpolators().forEach(function (interpolator) {
        _this.select.append('option').property('value', interpolator).text(interpolator);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }

      this.select.property('value', asString(this.props.interpolator));
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
        interpolator: this.props.interpolator,
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

var InterpolateSelector = function () {
  function InterpolateSelector(parent, props) {
    classCallCheck(this, InterpolateSelector);

    this.parent = parent;
    this.update(props);
  }

  createClass(InterpolateSelector, [{
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
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('interpolate-selector'));

      this.select = this.root.append('select').property('selected', this.props.value).on('change', function change() {
        var value = this.value;
        if (value !== 'null') {
          that.props.onChange(d3Interpolate[value]);
        }
      });

      this.select.append('option').property('value', 'null').text('Interpolate');

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

      this.select.property('value', asString$1(this.props.value));
    }
  }]);
  return InterpolateSelector;
}();

var BooleanInput = function () {
  function BooleanInput(parent, props) {
    classCallCheck(this, BooleanInput);

    this.parent = parent;
    this.update(props);
  }

  createClass(BooleanInput, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.render();
    }
  }, {
    key: 'setup',
    value: function setup() {
      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('boolean-input'));

      var that = this;
      this.input = this.root.append('input').attr('type', 'checkbox').on('change', function changeCheck() {
        that.props.onChange(this.checked);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }

      this.input.property('checked', this.props.value);
    }
  }]);
  return BooleanInput;
}();

var NumberInput = function () {
  function NumberInput(parent, props) {
    classCallCheck(this, NumberInput);

    this.parent = parent;
    this.update(props);
  }

  createClass(NumberInput, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.render();
    }
  }, {
    key: 'startDrag',
    value: function startDrag() {
      var value = this.props.value;

      this.dragging = true;
      this.dragStartY = d3Selection.event.clientY;
      this.dragStartValue = value;
    }
  }, {
    key: 'drag',
    value: function drag() {
      var _props = this.props;
      var max = _props.max;
      var min = _props.min;
      var onChange = _props.onChange;


      var delta = d3Selection.event.clientY - this.dragStartY;

      // a minimum of 8 pixels of mousemovement to start a drag
      if (Math.abs(delta) < 8) {
        return;
      }

      var increment = Math.abs(this.dragStartValue * 0.01);

      // if it is an integer, minimum increment is 1
      var isInteger = false;
      if (this.dragStartValue === Math.round(this.dragStartValue)) {
        isInteger = max - min > 1; // treat as non-integer if range is less than 1
        if (isInteger) {
          increment = Math.max(0.25, Math.round(increment));
        } else {
          increment = Math.max(0.01, Math.round(increment));
        }
      }

      var newValue = this.dragStartValue + increment * -delta;
      if (isInteger) {
        newValue = Math.round(newValue);
      }

      // roughly get 2 decimal places if not an integer
      if (!isInteger) {
        newValue = Math.round(newValue * 100) / 100;
      }

      if (min != null && newValue < min) {
        newValue = min;
      } else if (max != null && newValue > max) {
        newValue = max;
      }

      onChange(newValue);
    }
  }, {
    key: 'endDrag',
    value: function endDrag() {
      this.dragging = undefined;
      this.dragStartY = undefined;
      this.dragStartValue = undefined;
    }
  }, {
    key: 'setup',
    value: function setup() {
      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('number-input'));

      var that = this;
      var _props2 = this.props;
      var min = _props2.min;
      var max = _props2.max;
      var step = _props2.step;


      this.input = this.root.append('input').attr('type', 'number').attr('min', min).attr('max', max).attr('step', step || (max - min) / 100 || undefined).on('change', function changeNumber() {
        that.props.onChange(this.value);
      }).on('mousedown', function mousedown() {
        var target = this;
        that.startDrag(target);
        d3Selection.select(window).on('mousemove.numberinput', function () {
          that.drag(target);
        }).on('mouseup.numberinput', function () {
          that.endDrag(target);
          d3Selection.select(window).on('mouseup.numberinput', null).on('mousemove.numberinput', null);
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }

      this.input.property('value', this.props.value);
    }
  }]);
  return NumberInput;
}();

var StatsHistogram = function () {
  function StatsHistogram(parent, props) {
    classCallCheck(this, StatsHistogram);

    this.parent = parent;
    this.update(props);
  }

  createClass(StatsHistogram, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.render();
    }
  }, {
    key: 'setup',
    value: function setup() {
      var width = 240;
      var height = 80;
      var margin = { top: 5, right: 10, bottom: 25, left: 30 };
      this.innerWidth = width - margin.left - margin.right;
      this.innerHeight = height - margin.bottom - margin.top;

      // create the main panel div
      this.root = d3Selection.select(this.parent).append('svg').attr('class', className('stats-chart')).attr('width', width).attr('height', height);

      this.g = this.root.append('g').attr('transform', 'translate(' + margin.left + ' ' + margin.top + ')');

      this.countRects = this.g.append('g').attr('class', 'count-rects');

      this.xAxis = this.g.append('g').attr('class', 'axis axis--x').attr('transform', 'translate(0, ' + this.innerHeight + ')');

      this.yAxis = this.g.append('g').attr('class', 'axis axis--y');
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }
      var _props = this.props;
      var data = _props.data;
      var timeScale = _props.timeScale;

      // keep old data rendered when data resets

      if (!data.length) {
        return;
      }
      var innerHeight = this.innerHeight;
      var innerWidth = this.innerWidth;

      var xScale = void 0;
      if (timeScale === 'scaleTime') {
        xScale = d3Scale.scaleTime().range([0, innerWidth]);
      } else if (timeScale === 'scaleUtc') {
        xScale = d3Scale.scaleUtc().range([0, innerWidth]);
      } else {
        xScale = d3Scale.scaleLinear().range([0, innerWidth]);
      }

      var yScale = d3Scale.scaleLinear().range([innerHeight, 0]);

      // filter out infinite values
      var filteredData = data.filter(function (d) {
        return d < Infinity && d > -Infinity;
      });

      var xExtent = d3Array.extent(filteredData);
      xScale.domain(xExtent);
      this.xAxis.call(d3Axis.axisBottom(xScale).ticks(7));

      var bins = d3Array.histogram().domain(xScale.domain()).thresholds(xScale.ticks(20))(filteredData);

      yScale.domain([0, d3Array.max(bins, function (d) {
        return d.length;
      })]);
      this.yAxis.call(d3Axis.axisLeft(yScale).ticks(4));

      var bars = this.countRects.selectAll('.bar').data(bins);
      bars.exit().remove();
      var barsEnter = bars.enter().append('g').attr('class', 'bar');

      var sampleBin = bins[1] || bins[0]; // first one can be smaller so use second if available
      var barWidth = Math.max(1, xScale(sampleBin.x1) - xScale(sampleBin.x0) - 1);
      barsEnter.append('rect').attr('x', 1).attr('width', barWidth).style('fill', '#0bb');

      bars = bars.merge(barsEnter).attr('transform', function (d) {
        return 'translate(' + xScale(d.x0) + ', ' + yScale(d.length) + ')';
      }).each(function eachBar(d) {
        d3Selection.select(this).select('rect').attr('x', 1).attr('width', barWidth).attr('height', innerHeight - yScale(d.length)).style('fill', '#0bb');
      });
    }
  }]);
  return StatsHistogram;
}();

/**
 * Helper that returns true if the value is a color
 */
function isColor$1(value) {
  return value && d3Color.color(value) != null;
}

var StatsBarChart = function () {
  function StatsBarChart(parent, props) {
    classCallCheck(this, StatsBarChart);

    this.parent = parent;
    this.update(props);
  }

  createClass(StatsBarChart, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.render();
    }
  }, {
    key: 'setup',
    value: function setup() {
      var width = 240;
      var height = 80;
      var margin = { top: 5, right: 10, bottom: 25, left: 30 };
      this.innerWidth = width - margin.left - margin.right;
      this.innerHeight = height - margin.bottom - margin.top;

      // create the main panel div
      this.root = d3Selection.select(this.parent).append('svg').attr('class', className('stats-chart')).attr('width', width).attr('height', height);

      this.g = this.root.append('g').attr('transform', 'translate(' + margin.left + ' ' + margin.top + ')');

      this.countRects = this.g.append('g').attr('class', 'count-rects');

      this.xAxis = this.g.append('g').attr('class', 'axis axis--x').attr('transform', 'translate(0, ' + this.innerHeight + ')');

      this.yAxis = this.g.append('g').attr('class', 'axis axis--y');
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }
      var _props = this.props;
      var data = _props.data;
      var noXTicks = _props.noXTicks;

      // keep old data rendered when data resets

      if (!data.length) {
        return;
      }

      var innerHeight = this.innerHeight;
      var innerWidth = this.innerWidth;

      // setup the scales
      var xScale = d3Scale.scaleBand().rangeRound([0, innerWidth]).paddingInner(0.1);
      var yScale = d3Scale.scaleLinear().range([innerHeight, 0]);

      // const xExtent = extent(data, d => d.value);
      xScale.domain(data.map(function (d) {
        return d.value;
      }));
      yScale.domain([0, d3Array.max(data, function (d) {
        return d.count;
      })]);

      // setup the axes
      this.xAxis.call(d3Axis.axisBottom(xScale).ticks(7));
      this.yAxis.call(d3Axis.axisLeft(yScale).ticks(4));
      if (noXTicks) {
        this.xAxis.selectAll('.tick').remove();
      }

      // render the bars
      var bars = this.countRects.selectAll('.bar').data(data);
      bars.exit().remove();
      var barsEnter = bars.enter().append('g').attr('class', 'bar');

      var barWidth = xScale.bandwidth();

      barsEnter.append('rect').attr('x', 1).attr('width', barWidth).style('fill', '#0bb');

      bars = bars.merge(barsEnter).attr('transform', function (d) {
        return 'translate(' + xScale(d.value) + ', ' + yScale(d.count) + ')';
      }).each(function eachBar(d) {
        d3Selection.select(this).select('rect').attr('x', 1).attr('width', barWidth).attr('height', innerHeight - yScale(d.count)).style('fill', function (d) {
          return isColor$1(d.value) ? d.value : '#0bb';
        });
      });
    }
  }]);
  return StatsBarChart;
}();

function countArray(counts, mapFrom) {
  mapFrom = mapFrom || Object.keys(counts).sort();
  return mapFrom.map(function (value) {
    return {
      value: value,
      count: counts[value] || 0
    };
  });
}

var StatsPanel = function () {
  function StatsPanel(parent, props) {
    classCallCheck(this, StatsPanel);

    this.parent = parent;
    this.update(props);
  }

  createClass(StatsPanel, [{
    key: 'update',
    value: function update(nextProps) {
      this.props = nextProps;
      this.render();
    }
  }, {
    key: 'setup',
    value: function setup() {
      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('stats-panel'));

      this.domainRoot = this.root.append('div').attr('class', className('stats-domain'));

      this.domainRoot.append('h4').text('Domain Counts');

      this.domainStatus = this.domainRoot.append('span').attr('class', className('stats-status'));

      this.domainChartContainer = this.domainRoot.append('div');

      this.rangeRoot = this.root.append('div').attr('class', className('stats-range'));

      this.rangeRoot.append('h4').text('Range Counts');

      this.rangeStatus = this.rangeRoot.append('span').attr('class', className('stats-status'));

      this.rangeChartContainer = this.rangeRoot.append('div');
    }
  }, {
    key: 'renderDomainChart',
    value: function renderDomainChart() {
      var scaleProxy = this.props.scaleProxy;

      var domain = scaleProxy.proxyScale.domain && scaleProxy.proxyScale.domain();

      // draw the domain chart if continuous or sequential
      if (scaleProxy.isContinuous() || scaleProxy.scaleType === 'scaleSequential') {
        this.domainChart = renderComponent(this.domainChart, StatsHistogram, this.domainChartContainer.node(), {
          data: scaleProxy.stats.domainHistogram,
          timeScale: scaleProxy.isTimeScale() && scaleProxy.scaleType
        });
        this.domainStatus.text('');

        // ordinal
      } else if (scaleProxy.isOrdinal()) {
        this.domainChart = renderComponent(this.domainChart, StatsBarChart, this.domainChartContainer.node(), {
          data: countArray(scaleProxy.stats.domainCounts, domain)
        });
        this.domainStatus.text('');

        // not supported, so remove it
      } else {
        if (this.domainChart) {
          this.domainChartContainer.selectAll('*').remove();
          this.domainChart = null;
        }
        this.domainStatus.text('Not available');
      }
    }
  }, {
    key: 'renderRangeChart',
    value: function renderRangeChart() {
      var scaleProxy = this.props.scaleProxy;

      // draw range chart if continuous

      if (scaleProxy.isContinuous() && typeof scaleProxy.proxyScale.range()[0] === 'number') {
        this.rangeChart = renderComponent(this.rangeChart, StatsHistogram, this.rangeChartContainer.node(), {
          data: scaleProxy.stats.rangeHistogram
        });
        this.rangeStatus.text('');

        // ordinal
      } else if (scaleProxy.isOrdinal()) {
        var counts = countArray(scaleProxy.stats.rangeCounts);
        this.rangeChart = renderComponent(this.rangeChart, StatsBarChart, this.rangeChartContainer.node(), {
          data: counts,
          noXTicks: counts.length > 7
        });
        this.rangeStatus.text('');

        // sequential is special case
      } else if (scaleProxy.isContinuous() || scaleProxy.scaleType === 'scaleSequential') {
        // order the keys by HSL lightness
        var keysByLightness = Object.keys(scaleProxy.stats.rangeCounts).sort(function (a, b) {
          return d3Color.hsl(a).l - d3Color.hsl(b).l;
        });

        this.rangeChart = renderComponent(this.rangeChart, StatsBarChart, this.rangeChartContainer.node(), {
          data: countArray(scaleProxy.stats.rangeCounts, keysByLightness),
          noXTicks: true
        });
        this.rangeStatus.text('');

        // not supported
      } else {
        if (this.rangeChart) {
          this.rangeChartContainer.selectAll('*').remove();
          this.rangeChart = null;
        }
        this.rangeStatus.text('Not available');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }

      this.renderDomainChart();
      this.renderRangeChart();
    }
  }]);
  return StatsPanel;
}();

var ScalePanel = function () {
  function ScalePanel(parent, props) {
    var _this = this;

    classCallCheck(this, ScalePanel);

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

      this.messageContainer = this.root.append('div').attr('class', className('message-container'));

      this.header = this.root.append('h3').attr('class', className('panel-header')).on('click', this.toggleView);

      this.inner = this.root.append('div').attr('class', className('panel-inner'));

      this.controls = this.inner.append('div').attr('class', className('scale-controls'));

      this.statsContainer = this.inner.append('div');

      this.itemsContainer = this.inner.append('div').attr('class', className('panel-items'));

      this.pinButton = this.controls.append('button').text('Pin').attr('title', 'Pin these settings - ignores scale modifications made outside of the UI').on('click', function () {
        if (_this2.scaleProxy.pinned) {
          _this2.showMessage('Using external scale changes');
          _this2.scaleProxy.unpin();
        } else {
          _this2.showMessage('Ignoring external scale changes');
          _this2.scaleProxy.pin();
        }
        _this2.pinButton.classed(className('active'), _this2.scaleProxy.pinned);
      });

      // generate code button
      this.controls.append('button').text('Code').attr('title', 'Output generated code to console').on('click', function () {
        _this2.showMessage('Code printed in console');

        console.log('const ' + _this2.scaleProxy.name + ' = ' + _this2.scaleProxy.generateCode());
      });

      // send to window button
      this.controls.append('button').text('Debug').attr('title', 'Add scale to window to debug in console').on('click', function () {
        _this2.showMessage('Added to console');

        /* eslint-disable no-underscore-dangle */
        window._scales = window._scales || {};
        var name = _this2.scaleProxy.name;
        window._scales[name] = _this2.scaleProxy.proxyScale;
        window._scales[name + 'Raw'] = _this2.scaleProxy.scale;
        window._scales[name + 'ScaleProxy'] = _this2.scaleProxy;

        console.log('Added scale ' + name + ' to _scales[\'' + name + '\']...\n', window._scales[name]);
        /* eslint-enable no-underscore-dangle */
      });

      this.statsButton = this.controls.append('button').text('Stats').on('click', this.toggleStats);

      this.controls.append('button').attr('class', className('reset-button')).text('Reset').on('click', function () {
        return _this2.scaleProxy.reset();
      });

      this.items = {};
    }

    // shows an ephemeral message in the panel header

  }, {
    key: 'showMessage',
    value: function showMessage(message) {
      var _this3 = this;

      this.messageContainer.text(message);
      this.messageContainer.classed(className('visible'), true);

      var messageVisibleTime = 1000;

      if (this.messageTimer) {
        clearTimeout(this.messageTimer);
        this.messageTimer = null;
      }
      this.messageTimer = setTimeout(function () {
        _this3.messageContainer.classed(className('visible'), false);
        _this3.messageTimer = null;
      }, messageVisibleTime);
    }
  }, {
    key: 'toggleStats',
    value: function toggleStats() {
      this.statsVisible = !this.statsVisible;
      if (this.statsVisible) {
        console.log('Stats for scale ' + this.scaleProxy.name + '\n', this.scaleProxy.stats);
      }

      this.render();
    }
  }, {
    key: 'toggleView',
    value: function toggleView() {
      this.visible = !this.visible;
      this.render();
    }
  }, {
    key: 'handleDomainNice',
    value: function handleDomainNice() {
      var newDomain = this.scaleProxy.proxyScale.nice().domain();
      this.scaleProxy.changeScaleProperty('domain', newDomain);
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
        onChange: this.handleDomainChange,
        onNice: this.handleDomainNice,
        maxLength: this.scaleProxy.scaleType === 'scaleSequential' ? 2 : undefined,
        range: this.scaleProxy.proxyScale.range && this.scaleProxy.proxyScale.range()
      });
    }
  }, {
    key: 'renderRangeInput',
    value: function renderRangeInput(parentNode) {
      this.rangeInput = renderComponent(this.rangeInput, RangeInput, parentNode, {
        range: this.scaleProxy.proxyScale.range(),
        onChange: this.handleRangeChange,
        domain: this.scaleProxy.proxyScale.domain(),
        scale: this.scaleProxy.scale,
        continuous: this.scaleProxy.isContinuous()
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
  }, {
    key: 'renderClampInput',
    value: function renderClampInput(parentNode) {
      this.clampInput = renderComponent(this.clampInput, BooleanInput, parentNode, {
        value: this.scaleProxy.proxyScale.clamp(),
        onChange: this.handleClampChange
      });
    }
  }, {
    key: 'renderExponentInput',
    value: function renderExponentInput(parentNode) {
      this.exponentInput = renderComponent(this.exponentInput, NumberInput, parentNode, {
        value: this.scaleProxy.proxyScale.exponent(),
        min: 0,
        max: 20,
        step: 1,
        onChange: this.handleExponentChange
      });
    }
  }, {
    key: 'renderBaseInput',
    value: function renderBaseInput(parentNode) {
      this.baseInput = renderComponent(this.baseInput, NumberInput, parentNode, {
        value: this.scaleProxy.proxyScale.base(),
        min: 1,
        max: 20,
        step: 1,
        onChange: this.handleBaseChange
      });
    }
  }, {
    key: 'renderInterpolateInput',
    value: function renderInterpolateInput(parentNode) {
      this.interpolateInput = renderComponent(this.interpolateInput, InterpolateSelector, parentNode, {
        value: this.scaleProxy.proxyScale.interpolate(),
        onChange: this.handleInterpolateChange
      });
    }
  }, {
    key: 'renderRoundInput',
    value: function renderRoundInput(parentNode) {
      this.roundInput = renderComponent(this.roundInput, BooleanInput, parentNode, {
        value: this.scaleProxy.proxyScale.round(),
        onChange: this.handleRoundChange
      });
    }
  }, {
    key: 'renderPaddingInput',
    value: function renderPaddingInput(parentNode) {
      this.paddingInput = renderComponent(this.paddingInput, NumberInput, parentNode, {
        value: this.scaleProxy.proxyScale.padding(),
        min: 0,
        max: 1,
        step: 0.05,
        onChange: this.handlePaddingChange
      });
    }
  }, {
    key: 'renderPaddingInnerInput',
    value: function renderPaddingInnerInput(parentNode) {
      this.paddingInnerInput = renderComponent(this.paddingInnerInput, NumberInput, parentNode, {
        value: this.scaleProxy.proxyScale.paddingInner(),
        min: 0,
        max: 1,
        step: 0.05,
        onChange: this.handlePaddingInnerChange
      });
    }
  }, {
    key: 'renderPaddingOuterInput',
    value: function renderPaddingOuterInput(parentNode) {
      this.paddingOuterInput = renderComponent(this.paddingOuterInput, NumberInput, parentNode, {
        value: this.scaleProxy.proxyScale.paddingOuter(),
        min: 0,
        max: 1,
        step: 0.05,
        onChange: this.handlePaddingOuterChange
      });
    }
  }, {
    key: 'renderAlignInput',
    value: function renderAlignInput(parentNode) {
      this.alignInput = renderComponent(this.alignInput, NumberInput, parentNode, {
        value: this.scaleProxy.proxyScale.align(),
        min: 0,
        max: 1,
        step: 0.05,
        onChange: this.handleAlignChange
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
  }, {
    key: 'renderItem',
    value: function renderItem(label, _renderItem, scaleProp, stateKey) {
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
    key: 'renderStats',
    value: function renderStats() {
      this.statsContainer.style('display', this.statsVisible ? '' : 'none');
      this.statsButton.classed(className('active'), this.statsVisible);

      if (this.statsVisible) {
        this.statsPanel = renderComponent(this.statsPanel, StatsPanel, this.statsContainer.node(), {
          scaleProxy: this.scaleProxy
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.root) {
        this.setup();
      }

      this.root.classed(className('visible'), this.visible).classed(className('hidden'), !this.visible);

      this.header.text(this.scaleProxy.name);
      if (this.visible) {
        this.renderItems();
        this.renderStats();
      }
    }
  }]);
  return ScalePanel;
}();

/**
 * Easy way to get CSS in the JS by appending it to the body during
 * construction of the UI
 */
var css = "\n.d3-scale-interactive-main {\n  font-weight: 200;\n  position: fixed;\n  right: 10px;\n  top: 0px;\n  background: #242424;\n  font-size: 12px;\n  width: 280px;\n  color: #fff;\n  overflow: auto;\n}\n\n.d3-scale-interactive-hidden .d3-scale-interactive-main-inner {\n  display: none;\n}\n\n.d3-scale-interactive-main-inner {\n  min-height: 50px;\n}\n\n.d3-scale-interactive-main-toggle {\n  font-size: 11px;\n  color: #ccc;\n  padding: 6px 10px;\n  cursor: pointer;\n  -webkit-user-select: none;  /* Chrome all / Safari all */\n  -moz-user-select: none;     /* Firefox all */\n  -ms-user-select: none;      /* IE 10+ */\n  user-select: none;\n}\n\n.d3-scale-interactive-main-toggle:hover {\n  background: #444;\n  color: #fff;\n}\n\n.d3-scale-interactive-panel {\n  position: relative;\n  background: rgba(0, 0, 0, 0.3);\n  padding: 10px;\n  margin-bottom: 5px;\n  border-bottom: 1px solid #111;\n}\n\n\n.d3-scale-interactive-type-selector select {\n  margin-right: 6px;\n}\n\n.d3-scale-interactive-panel a {\n  color: #039898;\n  text-decoration: none;\n}\n\n.d3-scale-interactive-panel a:hover {\n  text-decoration: underline;\n  color: #04b5b5;\n}\n\n.d3-scale-interactive-message-container {\n  pointer-events: none;\n  position: absolute;\n  right: 2px;\n  top: 2px;\n  padding: 5px 15px;\n  background: #054e4e;\n  opacity: 0;\n  transition: opacity .5s;\n}\n\n.d3-scale-interactive-message-container.d3-scale-interactive-visible {\n  opacity: 1;\n  transition: opacity .1s;\n}\n\n.d3-scale-interactive-scale-controls {\n  margin-bottom: 4px;\n}\n\n\n.d3-scale-interactive-panel-inner {\n  clear: both;\n}\n\n.d3-scale-interactive-hidden .d3-scale-interactive-panel-inner {\n  display: none;\n}\n\n.d3-scale-interactive-hidden.d3-scale-interactive-panel {\n  padding-bottom: 0;\n}\n\n.d3-scale-interactive-hidden.d3-scale-interactive-panel h3 {\n  color: #ccc;\n  font-weight: 200;\n}\n\n.d3-scale-interactive-panel:last-child {\n  margin-bottom: 0;\n}\n\n.d3-scale-interactive-panel-item {\n  margin-bottom: 8px;\n}\n\n.d3-scale-interactive-panel-item:last-child {\n  margin-bottom: 0;\n}\n\n.d3-scale-interactive-panel h3 {\n  padding: 5px;\n  margin: -5px -5px 0;\n  font-size: 12px;\n  text-transform: uppercase;\n  cursor: pointer;\n}\n\n.d3-scale-interactive-panel h3:hover {\n  background: #444;\n  color: #fff;\n  font-weight: 600;\n}\n\n.d3-scale-interactive-panel h4 {\n  margin: 0 0 3px;\n  font-size: 10px;\n  font-weight: 200;\n  text-transform: uppercase;\n  color: #ccc;\n}\n\n.d3-scale-interactive-panel input {\n  font-family: 'Source Code Pro', 'Monaco', 'Consolas', monospace;\n  color: #000;\n}\n\n.d3-scale-interactive-input-entry-field {\n  width: 150px;\n  margin-bottom: 4px;\n}\n\n.d3-scale-interactive-input-entry-field.d3-scale-interactive-draggable {\n  cursor: ns-resize;\n}\n\n.d3-scale-interactive-input-entry-add,\n.d3-scale-interactive-input-entry-remove {\n  box-sizing: content-box;\n  display: inline-block;\n  padding: 5px;\n  background: #333;\n  border-radius: 100%;\n  height: 10px;\n  width: 10px;\n  text-align: center;\n  line-height: 10px;\n  font-weight: normal;\n  color: #aaa;\n  margin-left: 5px;\n  cursor: pointer;\n}\n\n.d3-scale-interactive-input-entry-add:hover,\n.d3-scale-interactive-input-entry-remove:hover {\n  background: #111;\n  color: #fff;\n}\n\n.d3-scale-interactive-input-entry-color {\n  width: 30px;\n  margin-left: 5px;\n  outline: 0;\n  background: transparent;\n  border: 0;\n  height: 19px;\n}\n\n.d3-scale-interactive-input-entry-remove.d3-scale-interactive-hidden,\n.d3-scale-interactive-input-entry-color.d3-scale-interactive-hidden {\n  display: none;\n}\n\n.d3-scale-interactive-main .d3-scale-interactive-reset-button {\n  float: right;\n}\n\n.d3-scale-interactive-main button::-moz-focus-inner {\n  padding: 0;\n  border: 0\n}\n\n.d3-scale-interactive-main button {\n  font-size: 10px;\n  text-transform: uppercase;\n  display: inline-block;\n  padding: 4px 8px;\n  font-weight: 200;\n  background-color: #333;\n  border: 1px solid transparent;\n  color: #aaa;\n  cursor: pointer;\n  margin: 0 4px 4px 0;\n}\n\n\n.d3-scale-interactive-main button.d3-scale-interactive-active,\n.d3-scale-interactive-main button:hover {\n  background-color: #111;\n  color: #fff;\n  border-color: #444;\n\n}\n\n.d3-scale-interactive-color-bar-box {\n  display: inline-block;\n  height: 15px;\n  border-radius: 0;\n}\n.d3-scale-interactive-stats-panel {\n  margin-bottom: 8px;\n}\n\n.d3-scale-interactive-stats-chart .axis path,\n.d3-scale-interactive-stats-chart .axis line {\n  stroke: #444;\n}\n.d3-scale-interactive-stats-chart .axis text {\n  fill: #777;\n}\n\n.d3-scale-interactive-stats-status {\n  font-style: italic;\n  color: #777;\n  font-size: 11px;\n}\n";

var MainContainer = function () {
  function MainContainer(parent) {
    var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    classCallCheck(this, MainContainer);

    this.parent = parent;
    this.visible = !props.startHidden;

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
      var _this = this;

      // create the main panel div
      this.root = d3Selection.select(this.parent).append('div').attr('class', className('main')).datum(this);

      this.inner = this.root.append('div').attr('class', className('main-inner'));

      this.toggle = this.root.append('div').attr('class', className('main-toggle')).on('click', this.toggleView);

      // add in CSS
      this.root.append('style').attr('class', 'd3-scale-interactive-style').text(css);

      // resize height on window resize
      d3Selection.select(window).on('resize', function () {
        _this.updateHeight();
      });
    }
  }, {
    key: 'toggleView',
    value: function toggleView() {
      this.visible = !this.visible;
      this.render();
    }
  }, {
    key: 'updateHeight',
    value: function updateHeight() {
      // set the max height
      this.root.style('max-height', window.innerHeight + 'px');
    }
  }, {
    key: 'renderScales',
    value: function renderScales() {
      var _this2 = this;

      this.scaleProxies.forEach(function (scaleProxy, i) {
        _this2.panels[i] = renderComponent(_this2.panels[i], ScalePanel, _this2.inner.node(), {
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

      // set the max height
      this.updateHeight();

      this.root.classed(className('visible'), this.visible).classed(className('hidden'), !this.visible);

      this.toggle.text(this.visible ? 'Hide scales' : 'Show d3-scale-interactive');
      if (this.visible) {
        this.renderScales();
      }
    }
  }]);
  return MainContainer;
}();

var activeScales = {};
var options = { startHidden: false };

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
  // create a new container if necessary, otherwise add to existing
  var main = d3Selection.select('.' + className('main'));
  var mainContainer = void 0;
  if (main.empty()) {
    mainContainer = new MainContainer(document.body, options);
  } else {
    mainContainer = main.datum();
  }

  var scaleProxy = void 0;
  if (!activeScales[name]) {
    scaleProxy = new ScaleProxy(name);
    activeScales[name] = scaleProxy;
    mainContainer.addScale(scaleProxy);
  } else {
    scaleProxy = activeScales[name];
  }

  // listen for updates and update the chart accordingly
  scaleProxy.on('update.chart', function () {
    update();
  });

  return scaleProxy;
}

/**
 * Function to set global options for the interactive scale
 * Currently, the options are:
 *
 * -  {Boolean} **startHidden**=false If set to true, the UI starts collapsed
 */
scaleInteractive.options = function scaleInteractiveOptions(newOptions) {
  return Object.assign(options, newOptions);
};

exports.scaleInteractive = scaleInteractive;

Object.defineProperty(exports, '__esModule', { value: true });

})));