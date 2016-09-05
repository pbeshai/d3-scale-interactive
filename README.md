# d3-scale-interactive

[![npm version](https://badge.fury.io/js/d3-scale-interactive.svg)](https://badge.fury.io/js/d3-scale-interactive)

Demo: http://peterbeshai.com/vis/d3-scale-interactive/

Modify your [d3-scales](https://github.com/d3/d3-scale) interactively in your browser with this plugin. You can change nearly all aspects of the scale via the user interface and see your charts update dynamically.

![d3-scale-interactive-demo](https://cloud.githubusercontent.com/assets/793847/18257484/5f7d617e-7392-11e6-8bd1-c49a4eca94d2.gif)

## Idea

Idea

The idea: what if you could interactively play with your scales in any vis, just by replacing your initialization of the scales from

```js
const colorScale = d3.scaleSequential(...);
```

with

```js
const colorScale = d3.scaleInteractive('color', updateChart).scaleSequential(...);
```

This way it's easy to develop with/turn on and off. Maybe there could even be a check to see if we're in dev otherwise just return the scale as it is and do nothing.

### Example
Original

```js
color = d3
  .scaleSequential(d3.interpolateMagma)
  .domain(d3.extent(data, d => d.v));
```

With interactivity

```js
color = d3.scaleInteractive('color', updateChart)
  .scaleSequential(d3.interpolateMagma)
  .domain(d3.extent(data, d => d.v));
```


## Development

Get rollup watching for changes and rebuilding

```bash
npm run watch
```

Run a web server in the example directory

```bash
cd example
php -S localhost:8000
```

Go to http://localhost:8000


## Installing

If you use NPM, `npm install d3-scale-interactive`. Otherwise, download the [latest release](https://github.com/pbeshai/d3-scale-interactive/releases/latest).

## API Reference

*Not complete yet. See the example or the source code.*

<a href="#scale-interactive" name="scale-interactive">#</a> <b>scaleInteractive</b>(name, updateFunction)
