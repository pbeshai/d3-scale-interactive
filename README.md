# d3-scale-interactive

[![npm version](https://badge.fury.io/js/d3-scale-interactive.svg)](https://badge.fury.io/js/d3-scale-interactive)

Demo: http://peterbeshai.com/vis/d3-scale-interactive/

Modify your [d3-scales](https://github.com/d3/d3-scale) interactively in your browser with this plugin. You can change nearly all aspects of the scale via the user interface and see your charts update dynamically.

![d3-scale-interactive-demo-1 1 2](https://cloud.githubusercontent.com/assets/793847/18312799/7d9ceeb6-74d9-11e6-85e1-dff08eaa2ef0.gif)


## Idea

What if you could interactively play with your scales in any vis, just by replacing your initialization of the scales 

```js
const colorScale = d3.scaleSequential(...);
```

with

```js
const colorScale = d3.scaleInteractive('color', updateChart).scaleSequential(...);
```

This way it's easy to develop with/turn on and off. Here `updateChart` is the function called to re-draw a chart with updated properties or data.

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

## User Interface Controls

Each scale gets its own panel in the user interface that can be collapsed or expanded by clicking the header. Beneath the header are five commands: Pin, Code, Debug, Stats, and Reset. 

![image](https://cloud.githubusercontent.com/assets/793847/18295536/2cdd0ec0-7470-11e6-912e-176d906a59d8.png)

### Pin

If your update callback recreates your scale or modifies some properties of the scale, you may want to pin the scale in the UI. This prevents all changes made outside the UI from affecting the scale. This control is a toggle.

### Code

Outputs the javascript code needed to recreate the scale to the browser's console. 

### Debug

Adds the scale to the global `_scales` object allowing you to access your scale in the console. Each scale will have three entries in `_scales`. If your scale name was `color`, you'd see:

- `_scales.color` - The scale object used by scaleInteractive. Updating values to this will be reflected automatically in the UI and in the stats collection.
- `_scales.colorRaw` - The d3 scale that is wrapped by scaleInteractive.
- `_scales.colorScaleProxy` - The [ScaleProxy](https://github.com/pbeshai/d3-scale-interactive/blob/master/src/ScaleProxy.js) object used by scaleInteractive.

### Stats

Displays histograms or bar charts of the domain and range values used by the scale. This control is a toggle. 

![image](https://cloud.githubusercontent.com/assets/793847/18295496/f3636ee6-746f-11e6-8328-b6983458c883.png)

### Reset

Resets the changes made through the scaleInteractive user interface.


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

<a href="#scale-interactive" name="scale-interactive">#</a> **scaleInteractive**(*name*, *updateFunction*)

Creates an interactive UI in the browser to modify scale parameters within. You must provide a unique *name* for the scale, as well as *updateFunction* - the function used to redraw your visualization when data or other properties change. 

Example usage:

```js
var x = d3.scaleInteractive('x', updateChart).scaleLinear().domain([0, 10]).range([15, 100]);
...

function updateChart(newData) {
  d3.selectAll('rect').data(newData)
     .attr('x', function (d) { return x(d.x); });
  ...
}

```


<a href="#scale-interactive-options" name="scale-interactive-options">#</a> **scaleInteractive.options**(*options*)

Updates the global scale interactive options with an *options* object. Currently there is only one option: 

- **startHidden** (default: `false`): initializes the main UI to begin collapsed
 
These options must be set before any other call to scaleInteractive as they are not read past initialization.

Example usage:

```js
d3.scaleInteractive.options({ startHidden: true });
```
