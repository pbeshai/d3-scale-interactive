import { select, event } from 'd3-selection';
import { color } from 'd3-color';
import { interpolate } from 'd3-interpolate';
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
    const oldValue = values[index];
    if (oldValue instanceof Date) {
      const [year, month, day] = newValue.split('-');
      newValue = new Date(year, month - 1, day);
    } else if (!isNaN(parseFloat(newValue))) {
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

    // attempt interpolation between the this and the next otherwise use this value
    const curr = oldValues[index];
    const next = oldValues[index + 1] == null ? curr : oldValues[index + 1];

    let newValue = interpolate(curr, next)(0.5);
    if (isColor(newValue)) {
      newValue = colorString(newValue);
    }

    const newValues = [...oldValues.slice(0, index + 1), newValue, ...oldValues.slice(index + 1)];
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

  renderEntry(entry, index, removable, addable) {
    let root = this.entries[index];

    if (!root) {
      const that = this;
      root = this.entries[index] = this.root.append('div')
        .attr('class', className('input-entry'));

      root.append('input')
        .attr('class', className('input-entry-field'))
        .attr('type', 'date')
        .on('change', function inputChange() {
          that.inputChange(this);
        })
        .on('mousedown', function mousedown() {
          const target = this;
          const index = parseInt(target.parentNode.getAttribute('data-index'), 10);

          // if not a number, disable dragging
          if (typeof that.props.values[index] !== 'number') {
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

    root.select(`.${className('input-entry-remove')}`)
      .style('display', removable ? '' : 'none');

    root.select(`.${className('input-entry-add')}`)
      .style('display', addable ? '' : 'none');

    root.attr('data-index', index);
    root.select(`.${className('input-entry-color')}`)
        .classed(className('hidden'), true);

    // handle if date
    if (entry instanceof Date) {
      const year = entry.getFullYear();
      const month = `0${entry.getMonth() + 1}`.slice(-2);
      const day = `0${entry.getDate()}`.slice(-2);
      root.select('input')
        .attr('type', 'date')
        .classed(className('draggable'), false)
        .property('value', `${year}-${month}-${day}`);

    // handle if color
    } else if (isColor(entry)) {
      root.select('input')
        .attr('type', 'text')
        .classed(className('draggable'), false)
        .property('value', entry);

      root.select(`.${className('input-entry-color')}`)
        .property('value', colorString(entry))
        .classed(className('hidden'), false);
    } else {
      root.select('input')
        .attr('type', 'text')
        .classed(className('draggable'), true)
        .property('value', entry);
    }
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    const { values, minLength, maxLength } = this.props;
    const removable = values.length > minLength;
    const addable = maxLength === undefined || values.length < maxLength;
    values.forEach((entry, i) => {
      this.renderEntry(entry, i, removable, addable);
    });

    // remove any excess entries
    this.entries.filter((entry, i) => i >= values.length).forEach(entry => entry.remove());
    this.entries = this.entries.slice(0, values.length);
  }
}
