import * as d3Interpolate from 'd3-interpolate';

const list = [
  'interpolate',
  'interpolateNumber',
  'interpolateRound',
  'interpolateString',
  'interpolateDate',
  'interpolateArray',
  'interpolateObject',
  'interpolateRgb',
  'interpolateHsl',
  'interpolateHslLong',
  'interpolateLab',
  'interpolateHcl',
  'interpolateHclLong',
  'interpolateCubehelix',
  'interpolateCubehelixLong',
];

/**
 * Function that lists available interpolators from d3-interpolate
 * Use a function just to match the other ones (e.g. d3ColorInterpolators)
 */
export default function d3Interpolators() {
  return list;
}

/**
 * Takes an interpolator function and returns its string name
 * @param {Function} interpolator e.g. d3.interpolateNumber
 * @return {String} The name e.g. "interpolateNumber"
 */
export function asString(interpolator) {
  for (let i = 0; i < list.length; i++) {
    if (d3Interpolate[list[i]] === interpolator) {
      return list[i];
    }
  }

  return undefined;
}
