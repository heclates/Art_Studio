// src/components/Modal.js

let modal = null
let previouslyFocusedElement = null
let isOpen = false
let closingFromPopState = false
let modalQueue = []

/* ================= POPSTATE ================= */

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    if (isOpen) {
      closingFromPopState = true
      closeModal()
      closingFromPopState = false
    }
  })
}

/* ================= KEYBOARD ================= */

if (typeof document !== 'undefined') {
  document.addEventListener('keydown', (event) => {
    if (!isOpen) return

    if (event.key === 'Escape') {
      closeModal()
      return
    }

    if (event.key === 'Tab') {
      trapFocus(event)
    }
  })
}

let touchStartX = 0
let touchStartY = 0
let isSwiping = false

const SWIPE_THRESHOLD = 80

function onTouchStart(e) {
  if (!isOpen) return
  const touch = e.touches[0]
  touchStartX = touch.clientX
  touchStartY = touch.clientY
  isSwiping = true
}

function onTouchMove(e) {
  if (!isOpen || !isSwiping) return
  const touch = e.touches[0]
  const dx = touch.clientX - touchStartX
  const dy = touch.clientY - touchStartY
  if (Math.abs(dy) > Math.abs(dx)) return
}

function onTouchEnd() {
  isSwiping = false
}

if (typeof document !== 'undefined') {
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchmove', onTouchMove, { passive: true })
  document.addEventListener('touchend', onTouchEnd)
}

/* ================= FOCUS ================= */

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => el.offsetParent !== null)
}

function trapFocus(event) {
  const focusable = getFocusableElements(modal)
  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey) {
    if (document.activeElement === first) {
      last.focus()
      event.preventDefault()
    }
  } else {
    if (document.activeElement === last) {
      first.focus()
      event.preventDefault()
    }
  }
}

/* ================= BUILD ================= */

function buildModal(titleId) {
  const root = document.createElement('div')
  root.className = 'confirmation-modal'
  root.setAttribute('role', 'dialog')
  root.setAttribute('aria-modal', 'true')
  root.setAttribute('tabindex', '-1')
  root.setAttribute('aria-labelledby', titleId)

  const overlay = document.createElement('div')
  overlay.className = 'confirmation-modal__overlay'
  overlay.addEventListener('click', closeModal)

  const wrapper = document.createElement('div')
  wrapper.className = 'confirmation-modal__wrapper'

  const closeBtn = document.createElement('button')
  closeBtn.className = 'modal__close'
  closeBtn.setAttribute('aria-label', 'Закрыть')
  closeBtn.textContent = '×'
  closeBtn.addEventListener('click', closeModal)

  wrapper.appendChild(closeBtn)
  root.append(overlay, wrapper)
  document.body.appendChild(root)

  return root
}

/* ================= OPEN ================= */

export function openModal(contentNode, titleId = 'modal-title') {
  if (isOpen) {
    modalQueue.push({ contentNode, titleId })
    return
  }

  previouslyFocusedElement = document.activeElement

  if (!modal) {
    modal = buildModal(titleId)
  } else {
    // обновляем aria-labelledby если изменился
    modal.setAttribute('aria-labelledby', titleId)
  }

  const wrapper = modal.querySelector('.confirmation-modal__wrapper')

  // очищаем предыдущий контент, оставляем кнопку закрытия
  Array.from(wrapper.children).forEach(el => {
    if (!el.classList.contains('modal__close')) el.remove()
  })

  wrapper.appendChild(contentNode)

  document.body.appendChild(modal)
  isOpen = true
  document.body.style.overflow = 'hidden'

  document.querySelectorAll('body > *:not(.confirmation-modal)').forEach(el => {
    el.setAttribute('aria-hidden', 'true')
  })

  // запускаем CSS-переход через .active
  requestAnimationFrame(() => {
    modal.classList.add('active')
  })

  const focusTarget = getFocusableElements(modal)[0] || modal
  focusTarget.focus()

  history.pushState({ modal: true }, '')
}

/* ================= CLOSE ================= */

export function closeModal() {
  if (!isOpen || !modal) return

  modal.classList.remove('active')
  isOpen = false

  document.body.style.overflow = ''

  document.querySelectorAll('[aria-hidden="true"]').forEach(el => {
    el.removeAttribute('aria-hidden')
  })

  previouslyFocusedElement?.focus()
  previouslyFocusedElement = null

  if (!closingFromPopState && history.state?.modal) {
    history.back()
  }

  const nextModal = modalQueue.shift()

  // ждём завершения CSS-перехода (0.3s) перед открытием следующего
  setTimeout(() => {
    if (nextModal) {
      openModal(nextModal.contentNode, nextModal.titleId)
    }
  }, 300)
}

/* ================= GLOBAL ================= */

if (typeof window !== 'undefined') {
  window.closeModal = closeModal
}