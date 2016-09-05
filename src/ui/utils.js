const cssRootPrefix = 'd3-scale-interactive';

export function className(suffix) {
  return `${cssRootPrefix}${suffix ? `-${suffix}` : ''}`;
}

export function renderComponent(instance, ComponentClass, parentNode, props) {
  // if it doesn't match the component class we are trying to make, destroy
  if (instance && !(instance instanceof ComponentClass)) {
    // destroy
    instance.root.remove();
    instance = null;
  }
  if (!instance) {
    instance = new ComponentClass(parentNode, props);
  } else {
    instance.update(props);
  }

  return instance;
}
