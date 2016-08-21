const cssRootPrefix = 'd3-scale-interactive';

export function className(suffix) {
  return `${cssRootPrefix}${suffix ? `-${suffix}` : ''}`;
}

export function renderComponent(instance, ComponentClass, parentNode, props) {
  if (!instance) {
    instance = new ComponentClass(parentNode, props);
  } else {
    instance.update(props);
  }

  return instance;
}
