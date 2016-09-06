import { select } from 'd3-selection';
import ScaleProxy from './ScaleProxy';
import MainContainer from './ui/MainContainer';
import { className } from './ui/utils';

const activeScales = {};
const options = { startHidden: false };

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
export default function scaleInteractive(name, update) {
  // create a new container if necessary, otherwise add to existing
  const main = select(`.${className('main')}`);
  let mainContainer;
  if (main.empty()) {
    mainContainer = new MainContainer(document.body, options);
  } else {
    mainContainer = main.datum();
  }

  let scaleProxy;
  if (!activeScales[name]) {
    scaleProxy = new ScaleProxy(name);
    activeScales[name] = scaleProxy;
    mainContainer.addScale(scaleProxy);
  } else {
    scaleProxy = activeScales[name];
  }

  // listen for updates and update the chart accordingly
  scaleProxy.on('update.chart', () => { update(); });

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
