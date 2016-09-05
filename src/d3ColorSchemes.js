import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';

const scaleKeys = Object.keys(d3Scale).concat(Object.keys(d3ScaleChromatic));

/**
 * Function that lists available color schemes
 */
export default function d3ColorSchemes() {
  const list = [
    'schemeCategory10',
    'schemeCategory20',
    'schemeCategory20b',
    'schemeCategory20c',
    'schemeAccent',
    'schemeDark2',
    'schemePaired',
    'schemePastel1',
    'schemePastel2',
    'schemeSet1',
    'schemeSet2',
    'schemeSet3',
  ];

  // filter only those available in case d3-scale-chromatic not there
  return list.filter(name => scaleKeys.includes(name));
}


/**
 * Takes an color scheme function and returns its string name
 * @param {Function} scheme e.g. d3.schemeAccent
 * @return {String} The name e.g. "schemeAccent"
 */
export function asString(scheme) {
  const list = d3ColorSchemes();

  // lazy shallow equals with stringify
  const schemeString = JSON.stringify(scheme);

  for (let i = 0; i < list.length; i++) {
    if (JSON.stringify(d3Scale[list[i]]) === schemeString || JSON.stringify(d3ScaleChromatic[list[i]]) === schemeString) {
      return list[i];
    }
  }

  return undefined;
}
