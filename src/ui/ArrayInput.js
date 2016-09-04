import { select, event } from 'd3-selection';
import { color } from 'd3-color';
import { className } from './utils';

/**
 * Get a color as #rrggbb for input type='color'
 */
function colorString(value) {
  const asColor = color(value);
  const r = asColor.r.toString(16);
  const g = asColor.g.toString(16);
  const b = asColor.b.toString(16);

  return `#${r.length === 1 ? '0' : ''}${r}${g.length === 1 ? '0' : ''}${g}${b.length === 1 ? '0' : ''}${b}`;
}

/**
 * Helper that returns true if the value is a color
 */
function isColor(value) {
  return value && color(value) != null;
}

export default class ArrayInput {
  constructor(parent, props) {
    this.parent = parent;
    this.update(props);

    this.addEntry = this.addEntry.bind(this);
    this.removeEntry = this.removeEntry.bind(this);
  }

  update(nextProps) {
    this.props = nextProps;
    this.render();
  }

  setup() {
    // create the main panel div
    this.root = select(this.parent)
      .append('div')
        .attr('class', className('array-input'));

    this.entries = [];
  }

  /**
   * Callback for when an input field is modified
   */
  inputChange(target) {
    const index = parseInt(target.parentNode.getAttribute('data-index'), 10);
    const { values, onChange } = this.props;
    const oldValues = values;

    // try to convert it to a number
    let newValue = target.value;
    if (!isNaN(parseFloat(newValue))) {
      newValue = parseFloat(newValue);
    }

    const newValues = [...oldValues.slice(0, index), newValue, ...oldValues.slice(index + 1)];
    onChange(newValues);
  }

  /**
   * Callback for when a new entry should be added
   */
  addEntry(target) {
    const index = parseInt(target.parentNode.getAttribute('data-index'), 10);

    const { values, onChange } = this.props;
    const oldValues = values;
    const newValues = [...oldValues.slice(0, index + 1), oldValues[index], ...oldValues.slice(index + 1)];
    onChange(newValues);
  }

  /**
   * Callback for when an entry should be removed.
   */
  removeEntry(target) {
    const index = parseInt(target.parentNode.getAttribute('data-index'), 10);

    const { values, onChange } = this.props;
    const oldValues = values;
    const newValues = [...oldValues.slice(0, index), ...oldValues.slice(index + 1)];
    onChange(newValues);
  }

  startDrag(target) {
    const index = parseInt(target.parentNode.getAttribute('data-index'), 10);
    const { values } = this.props;
    this.dragging = target;
    this.dragStartY = event.clientY;
    this.dragStartValue = values[index];
  }

  drag(target) {
    const index = parseInt(target.parentNode.getAttribute('data-index'), 10);
    const { values, onChange } = this.props;

    const delta = event.clientY - this.dragStartY;

    // a minimum of 8 pixels of mousemovement to start a drag
    if (Math.abs(delta) < 8) {
      return;
    }

    const oldValues = values;
    let increment = Math.abs(this.dragStartValue * 0.01);

    // if it is an integer, minimum increment is 1
    let isInteger = false;
    if (this.dragStartValue === Math.round(this.dragStartValue)) {
      isInteger = true;
      increment = Math.max(1, Math.round(increment));
    }

    let newValue = this.dragStartValue + (increment * -delta);

    // roughly get 2 decimal places if not an integer
    if (!isInteger) {
      newValue = Math.round(newValue * 100) / 100;
    }

    const newValues = [...oldValues.slice(0, index), newValue, ...oldValues.slice(index + 1)];
    onChange(newValues);
  }

  endDrag() {
    this.dragging = undefined;
    this.dragStartY = undefined;
    this.dragStartValue = undefined;
  }

  renderEntry(entry, index, removable) {
    let root = this.entries[index];

    if (!root) {
      const that = this;
      root = this.entries[index] = this.root.append('div')
        .attr('class', className('input-entry'));

      root.append('input')
        .attr('class', className('input-entry-field'))
        .attr('type', 'text')
        .on('change', function inputChange() {
          that.inputChange(this);
        })
        .on('mousedown', function mousedown() {
          const target = this;
          if (isColor(this.value)) {
            return;
          }

          that.startDrag(target);
          select(window)
            .on('mousemove.arrayinput', () => {
              that.drag(target);
            })
            .on('mouseup.arrayinput', () => {
              that.endDrag(target);
              select(window).on('mouseup.arrayinput', null)
                .on('mousemove.arrayinput', null);
            });
        });


      root.append('span')
        .attr('class', className('input-entry-add'))
        .text('+')
        .on('click', function addClick() {
          that.addEntry(this);
        });
      root.append('span')
        .attr('class', className('input-entry-remove'))
        .text('×')
        .on('click', function removeClick() {
          that.removeEntry(this);
        });

      root.append('input')
        .attr('class', className('input-entry-color'))
        .attr('type', 'color')
        .on('change', function colorChange() {
          that.inputChange(this);
        });
    }

    root.select('input').property('value', entry);
    root.select(`.${className('input-entry-remove')}`).classed(className('hidden'), !removable);
    root.attr('data-index', index);

    // handle if color
    if (isColor(entry)) {
      root.select('input').classed(className('draggable'), false);
      root.select(`.${className('input-entry-color')}`)
        .property('value', colorString(entry))
        .classed(className('hidden'), false);
    } else {
      root.select('input').classed(className('draggable'), true);
      root.select(`.${className('input-entry-color')}`)
        .classed(className('hidden'), true);
    }
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    const { values, minLength } = this.props;
    const removable = values.length > minLength;

    values.forEach((entry, i) => {
      this.renderEntry(entry, i, removable);
    });

    // remove any excess entries
    this.entries.filter((entry, i) => i >= values.length).forEach(entry => entry.remove());
  }
}
