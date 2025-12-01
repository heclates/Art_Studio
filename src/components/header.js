export function createHeader(props = { title: 'Art-Studio: Резервация' }) {
  const header = document.createElement('header');
  header.className ='header';
  header.setAttribute('role', 'banner');
  header.innerHTML = `<h1>${props.title}</h1>`; 

  header.innerHTML = `<h1>${props.title}</h1>`;

  header.innerHTML = `<h1>${props.title}</h1>`;

  return header;
}