// CoursesModal.js
import { el } from '@/utils/createElement'

export const createCourseDetailsModal = (course) => {
  const wrapper = el('div', { class: 'course-modal' })

  /* IMAGE */

  if (course.img) {
  wrapper.append(
    el('div', {
      class: 'course-modal__image',
      children: [
        el('img', {
          src: course.img,
          alt: course.name,
          loading: 'lazy'
        })
      ]
    })
  )
}


  /* CONTENT */

  const content = el('div', { class: 'course-modal__content' })

  content.append(
    el('h2', {
      id: 'modal-title',
      class: 'course-modal__title',
      textContent: course.name
    })
  )

  if (course.fullDescription) {
    content.append(
      el('p', {
        class: 'course-modal__description',
        textContent: course.fullDescription
      })
    )
  }

  /* INCLUDES */

  if (Array.isArray(course.includes) && course.includes.length) {
    content.append(
      el('h3', {
        class: 'course-modal__subtitle',
        textContent: course.includesTitle || 'Что входит'
      }),
      el('ul', {
        class: 'course-modal__list',
        children: course.includes.map(item =>
          el('li', { textContent: item })
        )
      })
    )
  }

  /* BUTTON */

  content.append(
    el('button', {
      class: 'course-modal__button',
      textContent: course.button || 'Записаться',
      type: 'button'
    })
  )

  wrapper.append(content)

  return wrapper
}
