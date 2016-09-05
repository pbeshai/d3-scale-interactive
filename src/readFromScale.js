const ignoreKeysOnRead = [
  'bandwidth',
  'copy',
  'invert',
  'nice',
  'quantiles',
  'rangeRound',
  'step',
  'ticks',
  'tickFormat',
];

/**
 * Copy from the readScales to the writeScale
 *
 * @param {Function} writeScale an instantiated scale to write properties to
 * @param {Function} readScales an instantiated scale to read properties from
 * @return {Function} writeScale with updated properties
 */
export default function readFromScale(writeScale, ...readScales) {
  function processKey(key) {
    if (typeof writeScale[key] === 'function' && !ignoreKeysOnRead.includes(key)) {
      // use the value from the first read scale that has this function
      for (let i = 0; i < readScales.length; i++) {
        const readScale = readScales[i];
        if (readScale && readScale[key]) {
          try {
            const value = readScale[key]();
            writeScale[key](value);
            break;
          } catch (e) { /* do nothing */ }
        }
      }
    }
  }

  Object.keys(writeScale).forEach(processKey);
  return writeScale;
}
