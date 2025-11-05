export function createFooter(props = { year: 2025 }) {
  const footer = document.createElement('footer');
  footer.setAttribute('role', 'contentinfo');
  footer.innerHTML = `<p>© ${props.year} Art-Studio</p>`;
  return footer;
}