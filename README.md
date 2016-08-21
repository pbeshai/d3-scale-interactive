# d3-scale-interactive

## This is currently very experimental.

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

## Things to consider

1. domain/range length 2? = show two input boxes that you can drag to change value, otherwise expand to 'eval' string
1. Add in histogram for statistics
1. Show d3 code on demand


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

*Not yet on NPM! Some day this will be true...*

If you use NPM, `npm install d3-scale-interactive`. Otherwise, download the [latest release](https://github.com/pbeshai/d3-scale-interactive/releases/latest).

## API Reference

*Not complete yet!*

<a href="#scale-interactive" name="scale-interactive">#</a> <b>scaleInteractive</b>(name, updateFunction)
