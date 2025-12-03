export const el = (tag, props = {}) => {
  const node = document.createElement(tag);

  // Core
  if (props.class) node.className = props.class;
  if (props.id) node.id = props.id;

  // Standard attributes
  ['src', 'alt', 'href', 'target', 'rel', 'type', 'value', 'role']
    .forEach(attr => props[attr] && (node[attr] = props[attr]));

  // Text / HTML
  if (props.textContent) node.textContent = props.textContent;
  if (props.innerHTML) node.innerHTML = props.innerHTML;

  // Events
  if (props.onclick) node.addEventListener('click', props.onclick);

  // Children
  if (props.children) props.children.forEach(c => node.appendChild(c));

  // Rest
  Object.entries(props).forEach(([key, value]) => {
    if (!['class','id','src','alt','href','target','rel','type','value','role','textContent','innerHTML','children','onclick'].includes(key)) {
      node.setAttribute(key, value);
    }
  });

  return node;
};
