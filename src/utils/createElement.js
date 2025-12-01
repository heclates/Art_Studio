export const el = (tag, props = {}) => {
const element = document.createElement(tag);
// Специфические атрибуты
if (props.class) element.className = props.class;
if (props.id) element.id = props.id;
if (props.src) element.src = props.src;
if (props.alt) element.alt = props.alt;
if (props.href) element.href = props.href;
if (props.target) element.target = props.target;
if (props.rel) element.rel = props.rel;
// Текст/контент
if (props.textContent) element.textContent = props.textContent;
if (props.innerHTML) element.innerHTML = props.innerHTML;
// Дети
if (props.children && Array.isArray(props.children)) {
props.children.forEach(child => element.appendChild(child));
}
// Любые другие атрибуты
Object.entries(props).forEach(([key, value]) => {
if (!['class', 'id', 'src', 'alt', 'href', 'target', 'rel', 'textContent', 'innerHTML', 'children'].includes(key)) {
element.setAttribute(key, value);
}
});
return element;
};