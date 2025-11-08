let modal;

export function openModal(contentNode) {
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal';
    
    const overlay = document.createElement('div');
    overlay.className = 'modal__overlay';
    overlay.addEventListener('click', closeModal);

    const content = document.createElement('div');
    content.className = 'modal__content';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal__close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', closeModal);

    content.appendChild(closeBtn);
    modal.appendChild(overlay);
    modal.appendChild(content);

    document.body.appendChild(modal);
  }

  const modalContent = modal.querySelector('.modal__content');
  Array.from(modalContent.children).forEach(c => {
    if (!c.classList.contains('modal__close')) c.remove();
  });
  modalContent.appendChild(contentNode);

  modal.style.display = 'flex';
}

export function closeModal() {
  if (modal) modal.style.display = 'none';
}
