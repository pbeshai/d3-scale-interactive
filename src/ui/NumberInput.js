import { select, event } from 'd3-selection';
import { className } from './utils';

export default class NumberInput {
  constructor(parent, props) {
    this.parent = parent;
    this.update(props);
  }

  update(nextProps) {
    this.props = nextProps;
    this.render();
  }

  startDrag() {
    const { value } = this.props;
    this.dragging = true;
    this.dragStartY = event.clientY;
    this.dragStartValue = value;
  }

  drag() {
    const { max, min, onChange } = this.props;

    const delta = event.clientY - this.dragStartY;

    // a minimum of 8 pixels of mousemovement to start a drag
    if (Math.abs(delta) < 8) {
      return;
    }

    let increment = Math.abs(this.dragStartValue * 0.01);

    // if it is an integer, minimum increment is 1
    let isInteger = false;
    if (this.dragStartValue === Math.round(this.dragStartValue)) {
      isInteger = (max - min) > 1; // treat as non-integer if range is less than 1
      if (isInteger) {
        increment = Math.max(0.25, Math.round(increment));
      } else {
        increment = Math.max(0.01, Math.round(increment));
      }
    }

    let newValue = this.dragStartValue + (increment * -delta);
    if (isInteger) {
      newValue = Math.round(newValue);
    }

    // roughly get 2 decimal places if not an integer
    if (!isInteger) {
      newValue = Math.round(newValue * 100) / 100;
    }

    if (min != null && newValue < min) {
      newValue = min;
    } else if (max != null && newValue > max) {
      newValue = max;
    }

    onChange(newValue);
  }

  endDrag() {
    this.dragging = undefined;
    this.dragStartY = undefined;
    this.dragStartValue = undefined;
  }

  setup() {
    // create the main panel div
    this.root = select(this.parent)
      .append('div')
        .attr('class', className('number-input'));

    const that = this;
    const { min, max, step } = this.props;

    this.input = this.root.append('input')
      .attr('type', 'number')
      .attr('min', min)
      .attr('max', max)
      .attr('step', step || (max - min) / 100 || undefined)
      .on('change', function changeNumber() {
        that.props.onChange(this.value);
      })
      .on('mousedown', function mousedown() {
        const target = this;
        that.startDrag(target);
        select(window)
          .on('mousemove.numberinput', () => {
            that.drag(target);
          })
          .on('mouseup.numberinput', () => {
            that.endDrag(target);
            select(window).on('mouseup.numberinput', null)
              .on('mousemove.numberinput', null);
          });
      });
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    this.input.property('value', this.props.value);
  }
}
