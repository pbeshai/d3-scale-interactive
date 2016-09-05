import babel from 'rollup-plugin-babel';

var globals = {
  'd3-array': 'd3',
  'd3-axis': 'd3',
  'd3-color': 'd3',
  'd3-dispatch': 'd3',
  'd3-interpolate': 'd3',
  'd3-scale': 'd3',
  'd3-scale-chromatic': 'd3',
  'd3-selection': 'd3',
}

export default {
  entry: 'index.js',
  moduleName: 'd3',
  plugins: [babel()],
  globals: globals,
  external: Object.keys(globals),
  targets: [
    { format: 'umd', dest: 'build/d3-scale-interactive.js' },
    { format: 'umd', dest: 'example/d3-scale-interactive.js' },
  ]
};
