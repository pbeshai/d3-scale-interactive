/**
 * Function that lists available interpolators
 */
export default function d3Interpolators() {
  const list = [
    'interpolateViridis', 'interpolateInferno', 'interpolateMagma', 'interpolatePlasma',
    'interpolateWarm', 'interpolateCool', 'interpolateRainbow',
    'interpolateCubehelixDefault', 'interpolateBrBG', 'interpolatePRGn',
    'interpolatePiYG', 'interpolatePuOr', 'interpolateRdBu', 'interpolateRdGy',
    'interpolateRdYlBu', 'interpolateRdYlGn', 'interpolateSpectral',
    'interpolateBlues', 'interpolateGreens', 'interpolateGreys', 'interpolateOranges',
    'interpolatePurples', 'interpolateReds', 'interpolateBuGn', 'interpolateBuPu',
    'interpolateGnBu', 'interpolateOrRd', 'interpolatePuBuGn', 'interpolatePuBu',
    'interpolatePuRd', 'interpolateRdPu', 'interpolateYlGnBu', 'interpolateYlGn',
    'interpolateYlOrBr', 'interpolateYlOrRd'];

  // filter only those available in case d3-scale-chromatic not there
  return list.filter(name => (window.d3 ? window.d3[name] : true));
}
