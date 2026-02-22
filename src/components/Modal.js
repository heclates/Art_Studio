// src/components/Modal.js

let modal = null
let previouslyFocusedElement = null
let isOpen = false
let closingFromPopState = false

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

const SWIPE_THRESHOLD = 80 // px

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

  const absX = Math.abs(dx)
  const absY = Math.abs(dy)

  if (absY > absX) return
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

/* ================= OPEN ================= */

export function openModal(contentNode, titleId = 'modal-title') {
  if (isOpen) return

  previouslyFocusedElement = document.activeElement

  if (!modal) {
    modal = document.createElement('div')
    modal.className = 'modal'
    modal.setAttribute('role', 'dialog')
    modal.setAttribute('aria-modal', 'true')
    modal.setAttribute('tabindex', '-1')
    modal.setAttribute('aria-labelledby', titleId)

    const overlay = document.createElement('div')
    overlay.className = 'modal__overlay'
    overlay.addEventListener('click', closeModal)

    const content = document.createElement('div')
    content.className = 'modal__content'

    const closeBtn = document.createElement('button')
    closeBtn.className = 'modal__close'
    closeBtn.setAttribute('aria-label', 'Закрыть')
    closeBtn.textContent = '×'
    closeBtn.addEventListener('click', closeModal)

    content.appendChild(closeBtn)
    modal.append(overlay, content)
    document.body.appendChild(modal)
  }

  const contentContainer = modal.querySelector('.modal__content')

  Array.from(contentContainer.children).forEach(el => {
    if (!el.classList.contains('modal__close')) el.remove()
  })

  // 🔴 ВАЖНО: БЕЗ cloneNode
  contentContainer.appendChild(contentNode)

  modal.style.display = 'flex'
  isOpen = true

  document.body.style.overflow = 'hidden'

  document.querySelectorAll('body > *:not(.modal)').forEach(el => {
    el.setAttribute('aria-hidden', 'true')
  })

  const focusTarget = getFocusableElements(modal)[0] || modal
  focusTarget.focus()

  history.pushState({ modal: true }, '')
}

/* ================= CLOSE ================= */

export function closeModal() {
  if (!isOpen || !modal) return

  modal.style.display = 'none'
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
}

/* ================= GLOBAL ================= */

if (typeof window !== 'undefined') {
  window.closeModal = closeModal
}
