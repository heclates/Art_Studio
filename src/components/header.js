export function createHeader(props = { title: 'Art-Studio: Резервация' }) {
  const header = document.createElement('header');
  header.setAttribute('role', 'banner');
<<<<<<< HEAD
<<<<<<< HEAD
  header.innerHTML = `<h1>${props.title}</h1>`; 
=======
  header.innerHTML = `<h1>${props.title}</h1>`;
>>>>>>> form-fix
=======
  header.innerHTML = `<h1>${props.title}</h1>`;
>>>>>>> e45d372 (Make submit form)
  return header;
}