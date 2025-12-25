let modal;
let previouslyFocusedElement = null;

function handleKeyDown(event) {
    if (event.key === 'Escape' && modal && modal.style.display !== 'none') {
        closeModal();
        return;
    }

    if (event.key === 'Tab' && modal && modal.style.display !== 'none') {
        trapFocus(event);
    }
}

function trapFocus(event) {
    const focusableElements = getFocusableElements(modal);
    if (focusableElements.length === 0) return;

    const firstFocusableEl = focusableElements[0];
    const lastFocusableEl = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) { 
        if (document.activeElement === firstFocusableEl) {
            lastFocusableEl.focus();
            event.preventDefault();
        }
    } else { 
        if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus();
            event.preventDefault();
        }
    }
}

function getFocusableElements(container) {
    return Array.from(
        container.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
    ).filter(el => el.offsetParent !== null);
}

export function openModal(contentNode, titleId = 'modal-title') {
    previouslyFocusedElement = document.activeElement;
    
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', titleId);
        modal.setAttribute('tabindex', '-1'); 

        const overlay = document.createElement('div');
        overlay.className = 'modal__overlay';
        overlay.addEventListener('click', closeModal);

        const content = document.createElement('div');
        content.className = 'modal__content';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal__close';
        closeBtn.textContent = '×';
        closeBtn.setAttribute('aria-label', 'Закрыть модальное окно');
        closeBtn.addEventListener('click', closeModal);

        content.appendChild(closeBtn);
        modal.appendChild(overlay);
        modal.appendChild(content);

        document.body.appendChild(modal);

        document.addEventListener('keydown', handleKeyDown);
    }

    const modalContent = modal.querySelector('.modal__content');
    Array.from(modalContent.children).forEach(c => {
        if (!c.classList.contains('modal__close')) c.remove();
    });
    modalContent.appendChild(contentNode);

    modal.style.display = 'flex';
    
    const firstFocus = getFocusableElements(modal)[0] || modal;
    firstFocus.focus();
    
    document.querySelectorAll('body > *:not(.modal)').forEach(el => {
        el.setAttribute('aria-hidden', 'true');
    });
    
    document.body.style.overflow = 'hidden';
}

export function closeModal() {
    if (modal && modal.style.display !== 'none') {
        modal.style.display = 'none';

        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
            previouslyFocusedElement = null;
        }
        
        document.querySelectorAll('body > *[aria-hidden="true"]').forEach(el => {
            el.removeAttribute('aria-hidden');
        });

        document.body.style.overflow = '';
    }
}

// Экспортируем closeModal глобально для использования в формах
if (typeof window !== 'undefined') {
    window.closeModal = closeModal;
}