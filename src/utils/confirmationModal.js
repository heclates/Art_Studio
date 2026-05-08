import { el } from '@/utils/createElement.js';
import { openModal, closeModal } from '@/components/Modal.js';
import { getLanguage } from '@/utils/languageManager';
import ru from '@/i18n/forms/ru.js';
import cs from '@/i18n/forms/en.js';

/**
 * Open a confirmation modal with lesson/reservation details
 * @param {Object} options - Configuration options
 * @param {string} options.title - Modal title
 * @param {string} options.message - Main message/question
 * @param {Object} options.details - Booking details (date, time, location, direction, etc.)
 * @param {string} options.confirmText - Confirm button text (default: "Confirm")
 * @param {string} options.cancelText - Cancel button text (default: "Cancel")
 * @param {Function} options.onConfirm - Callback on confirm
 * @param {Function} options.onCancel - Callback on cancel
 * @returns {void}
 */
export const openConfirmationModal = (options) => {
  const {
    title,
    message,
    details = {},
    confirmText,
    cancelText,
    onConfirm = () => {},
    onCancel = () => {}
  } = options;

  const t = getLanguage() === 'ru' ? ru : cs;
  const titleText = title || t.confirmationTitle || 'Подтверждение';
  const messageText = message || t.confirm || 'Вы уверены?';
  const confirmTextLabel = confirmText || t.book || 'Подтвердить';
  const cancelTextLabel = cancelText || t.cancel || 'Отмена';

  const container = document.createDocumentFragment();

  const titleEl = el('h2', {
    class: 'confirmation-modal__title',
    textContent: titleText,
    id: 'confirmation-title'
  });
  container.appendChild(titleEl);

  const messageEl = el('p', {
    class: 'confirmation-modal__message',
    textContent: messageText
  });
  container.appendChild(messageEl);

  if (details && Object.keys(details).length > 0) {
    const detailsSection = el('div', { class: 'confirmation-modal__details' });

    Object.entries(details).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;

      const detailRow = el('div', { class: 'confirmation-modal__detail-row' });

      const label = el('span', {
        class: 'confirmation-modal__detail-label',
        textContent: key
      });

      const valueEl = el('span', {
        class: 'confirmation-modal__detail-value',
        textContent: value
      });

      detailRow.append(label, valueEl);
      detailsSection.appendChild(detailRow);
    });

    container.appendChild(detailsSection);
  }

  const actions = el('div', { class: 'confirmation-modal__actions' });

  const confirmBtn = el('button', {
    class: 'confirmation-modal__btn confirmation-modal__btn--confirm',
    type: 'button',
    textContent: confirmTextLabel,
    onclick: async () => {
      confirmBtn.disabled = true;
      try {
        await onConfirm();
        closeModal();
      } catch (error) {
        confirmBtn.disabled = false;
        throw error;
      }
    }
  });

  const cancelBtn = el('button', {
    class: 'confirmation-modal__btn confirmation-modal__btn--cancel',
    type: 'button',
    textContent: cancelTextLabel,
    onclick: () => {
      onCancel();
      closeModal();
    }
  });

  actions.append(confirmBtn, cancelBtn);
  container.appendChild(actions);

  openModal(container, 'confirmation-title');
};