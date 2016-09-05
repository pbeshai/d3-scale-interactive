/**
 * Easy way to get CSS in the JS by appending it to the body during
 * construction of the UI
 */
export default `
.d3-scale-interactive-main {
  font-weight: 200;
  position: fixed;
  right: 10px;
  top: 0px;
  background: rgba(0, 0, 0, 0.8);
  font-size: 12px;
  width: 280px;
  color: #fff;
  overflow: auto;
}

.d3-scale-interactive-hidden .d3-scale-interactive-main-inner {
  display: none;
}

.d3-scale-interactive-main-inner {
  min-height: 50px;
}

.d3-scale-interactive-main-toggle {
  font-size: 11px;
  color: #ccc;
  padding: 6px 10px;
  cursor: pointer;
  -webkit-user-select: none;  /* Chrome all / Safari all */
  -moz-user-select: none;     /* Firefox all */
  -ms-user-select: none;      /* IE 10+ */
  user-select: none;
}

.d3-scale-interactive-main-toggle:hover {
  background: #444;
  color: #fff;
}

.d3-scale-interactive-panel {
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  margin-bottom: 5px;
  border-bottom: 1px solid #111;
}

.d3-scale-interactive-hidden .d3-scale-interactive-panel-inner {
  display: none;
}

.d3-scale-interactive-hidden .d3-scale-interactive-reset-button {
  display: none;
}

.d3-scale-interactive-hidden.d3-scale-interactive-panel {
  padding-bottom: 0;
}

.d3-scale-interactive-panel:last-child {
  margin-bottom: 0;
}

.d3-scale-interactive-panel-item {
  margin-bottom: 8px;
}

.d3-scale-interactive-panel-item:last-child {
  margin-bottom: 0;
}

.d3-scale-interactive-panel h3 {
  padding: 5px;
  margin: -5px -5px 0;
  font-size: 12px;
  text-transform: uppercase;
  cursor: pointer;
}

.d3-scale-interactive-panel h3:hover {
  background: #444;
}

.d3-scale-interactive-panel h4 {
  margin: 0 0 3px;
  font-size: 10px;
  font-weight: 200;
  text-transform: uppercase;
  color: #ccc;
}

.d3-scale-interactive-panel input {
  font-family: 'Source Code Pro', 'Monaco', 'Consolas', monospace;
}

.d3-scale-interactive-input-entry-field {
  width: 150px;
  margin-bottom: 4px;
}

.d3-scale-interactive-input-entry-field.d3-scale-interactive-draggable {
  cursor: ns-resize;
}

.d3-scale-interactive-input-entry-add,
.d3-scale-interactive-input-entry-remove {
  display: inline-block;
  padding: 5px;
  background: #333;
  border-radius: 100%;
  height: 10px;
  width: 10px;
  text-align: center;
  line-height: 10px;
  font-weight: normal;
  color: #aaa;
  margin-left: 5px;
  cursor: pointer;
}

.d3-scale-interactive-input-entry-add:hover,
.d3-scale-interactive-input-entry-remove:hover {
  background: #111;
  color: #fff;
}

.d3-scale-interactive-input-entry-color {
  width: 30px;
  margin-left: 5px;
  outline: 0;
  background: transparent;
  border: 0;
  height: 19px;
}

.d3-scale-interactive-input-entry-remove.d3-scale-interactive-hidden,
.d3-scale-interactive-input-entry-color.d3-scale-interactive-hidden {
  display: none;
}

button,
.d3-scale-interactive-reset-button {
  font-size: 10px;
  text-transform: uppercase;
  display: inline-block;
  padding: 4px 12px;
  font-weight: 200;
  background-color: #333;
  border: 0;
  color: #aaa;
  cursor: pointer;
  margin: 0 4px 4px 0;
}

.d3-scale-interactive-reset-button {
  float: right;
  padding: 6px 12px;
  margin: -4px -4px 0 0;
}

button:hover,
.d3-scale-interactive-reset-button:hover {
  background-color: #111;
  color: #fff;
}

.d3-scale-interactive-color-bar-box {
  display: inline-block;
  height: 15px;
  border-radius: 0;
}
`;
