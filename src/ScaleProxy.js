import { dispatch } from 'd3-dispatch';
import * as d3Scale from 'd3-scale';
import supportedScales from './supportedScales';
import readFromScale from './readFromScale';

const Events = {
  // when we change the scale, update is fired
  update: 'update',

  // any time a setter is called on the scale, proxySet is fired
  proxySet: 'proxy-set',
};

// needed for on change scale by type to ensure we have valid initial settings
const defaultScales = {
  scaleOrdinal: d3Scale.scaleOrdinal(d3Scale.schemeCategory10),
  scaleSequential: d3Scale.scaleSequential(d3Scale.interpolateMagma),
  scalePow: d3Scale.scalePow().exponent(10),
};

/**
 * Class for proxying a d3 scale so it can change type and keep stats
 * without changing its reference or interface.
 */
export default class ScaleProxy {

  /**
   * Constructor
   * @param {String} name The name of the scale
   * @param {Function} update The function to call to redraw a chart
  */
  constructor(name) {
    this.name = name;
    this.dispatch = dispatch(Events.update, Events.proxySet);
    this.statsReset();

    this.scale = null;
    this.originalScale = null;
    this.proxyScale = this.proxyScale.bind(this);
  }


  on(event, callback) {
    this.dispatch.on(event, callback);
    return this;
  }

  update() {
    this.dispatch.call(Events.update, this);
  }

  /**
   * Changes the active scale and returns the proxy scale.
   *
   * @param {Function} scale The new active scale to set (e.g. d3.scaleLinear())
   * @param {String} [scaleType] A key for identifying the type of scale being set
   * @return {Function} the proxy scale
   */
  changeScale(scale, scaleType) {
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
  saveAsOriginalScale() {
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
  changeScaleType(scaleType) {
    const newScale = readFromScale(d3Scale[scaleType](), this.scale, defaultScales[scaleType]);

    // ensure minimum domain is non-zero for log scale
    if (scaleType === 'scaleLog') {
      const domain = newScale.domain();
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
  changeScaleProperty(property, value) {
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
  proxyScale(value) {
    const result = this.scale(value);
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
  updateProxyScaleFunctions(scale) {
    const newScaleKeys = Object.keys(scale);

    // remove excess keys
    Object.keys(this.proxyScale)
      .filter(proxyKey => !newScaleKeys.includes(proxyKey))
      .forEach(proxyKey => delete this.proxyScale[proxyKey]);

    // add in needed keys
    newScaleKeys.forEach(scaleKey => {
      this.proxyScale[scaleKey] = (...args) => {
        const result = this.scale[scaleKey](...args);

        // if the function returns the scale, return the proxy scale
        if (result === this.scale) {
          // this implies it was a setter
          this.dispatch.call(Events.proxySet, this, scaleKey, args);

          return this.proxyScale;
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
  reset() {
    this.changeScale(this.originalScale, this.originalScaleType);
  }

  /**
   * Reset stats about the scale
   *
   * @return {void}
   */
  statsReset() {
    this.stats = { domainCounts: {}, rangeCounts: {} };
  }

  /**
   * Record stats each time value is called
   *
   * @param {Any} domainValue The domain value
   * @param {Any} rangeValue The range value the scale produced
   * @return {void}
   */
  statsRecordValueUsed(domainValue, rangeValue) {
    const { domainCounts, rangeCounts } = this.stats;

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
}

ScaleProxy.Events = Events;

// Add in supported scales interface based on the supportedScales array
ScaleProxy.prototype.supportedScales = supportedScales;

// create interface for each d3 scale that is supported.
// this enables d3.scaleInteractive(...).scaleLinear()
supportedScales.forEach(scaleFuncName => {
  // e.g. set this.scaleLinear
  ScaleProxy.prototype[scaleFuncName] = function supportedScale(...args) {
    return this.changeScale(d3Scale[scaleFuncName](...args), scaleFuncName);
  };
});

