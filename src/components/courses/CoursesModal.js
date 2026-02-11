import { el } from '@/utils/createElement'

function parseTextToHTML(text) {
  if (!text) return '';

  const lines = text.split('\n').filter(line => line.trim());
  const htmlFragments = [];
  let inList = false;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('—') || trimmed.startsWith('–')) {
      if (!inList) {
        htmlFragments.push('<ul class="course-modal__list">');
        inList = true;
      }
      htmlFragments.push(`<li>${trimmed.slice(1).trim()}</li>`);  // Remove dash
    } else {
      if (inList) {
        htmlFragments.push('</ul>');
        inList = false;
      }
      htmlFragments.push(`<p>${trimmed}</p>`);
    }
  });

  if (inList) htmlFragments.push('</ul>');
  return htmlFragments.join('');
}

export const createCourseDetailsModal = (course) => {
  const wrapper = el('div', { class: 'course-modal' })

  /* 1. ИЗОБРАЖЕНИЕ (Остается сверху) */
  if (course.img) {
    wrapper.append(
      el('div', {
        class: 'course-modal__image',
        children: [el('img', { src: course.img, alt: course.name, loading: 'lazy' })]
      })
    )
  }

  /* 2. ОСНОВНОЙ КОНТЕНТ (Обертка для управления флексом) */
  const content = el('div', { class: 'course-modal__content' })

  /* СОЗДАЕМ СКРОЛЛЯЩУЮСЯ ОБЛАСТЬ */
  const scrollBody = el('div', { class: 'course-modal__body' })

  scrollBody.append(
    el('h2', {
      id: 'modal-title',
      class: 'course-modal__title',
      textContent: course.name
    })
  )

  if (course.fullDescription) {
    scrollBody.append(
      el('div', {
        class: 'course-modal__description',
        innerHTML: parseTextToHTML(course.fullDescription)
      })
    )
  }

  if (Array.isArray(course.includes) && course.includes.length) {
    scrollBody.append(
      el('h3', { class: 'course-modal__subtitle', textContent: course.includesTitle || 'Что входит' }),
      el('ul', {
        class: 'course-modal__list',
        children: course.includes.map(item => el('li', { textContent: item }))
      })
    )
  }

  /* 3. ФИКСИРОВАННАЯ КНОПКА (Вне scrollBody) */
  const button = el('button', {
    class: 'course-modal__button',
    textContent: course.button || 'Записаться',
    type: 'button'
  })

  // Собираем всё вместе
  content.append(scrollBody, button)
  wrapper.append(content)

  return wrapper
}