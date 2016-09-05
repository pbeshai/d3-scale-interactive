/**
 * Function that lists available color schemes
 */
export default function d3ColorSchemes() {
  const list = [
    'schemeCategory10',
    'schemeCategory20',
    'schemeCategory20b',
    'schemeCategory20c',
    'schemeAccent',
    'schemeDark2',
    'schemePaired',
    'schemePastel1',
    'schemePastel2',
    'schemeSet1',
    'schemeSet2',
    'schemeSet3',
  ];

  // filter only those available in case d3-scale-chromatic not there
  return list.filter(name => (window.d3 ? window.d3[name] : true));
}
