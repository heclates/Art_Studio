import { initSwiper } from '@/components/shift/ShiftSwiper'
import { el } from '@/utils/createElement'
import { getLanguage, subscribe } from '@/utils/languageManager'
import { coursesRU } from '@/i18n/courses/ru'
import { coursesEN } from '@/i18n/courses/en'
import { createCourseCard } from './CoursesCard'
import { createCourseDetailsModal } from './CoursesModal'
import { openModal } from '@/components/Modal'

/* =======================
   DATA
======================= */

const COURSES_MAP = {
  ru: coursesRU,
  en: coursesEN
}

const getCourseContent = (lang) => COURSES_MAP[lang] || COURSES_MAP.ru

/* =======================
   HANDLERS
======================= */

const createCourseClickHandler = (course) => () => {
  const modalContent = createCourseDetailsModal(course)
  openModal(modalContent, 'modal-title')
}


const filterCourses = (courses, filter) => {
  if (filter === 'all') return courses
  return courses.filter(course => course.category === filter)
}

/* =======================
   UI HELPERS
======================= */

const createFilterButtons = (labels, active = 'all') => {
  const container = el('div', { class: 'courses__filters' })

  Object.entries(labels).forEach(([key, label]) => {
    container.append(
      el('button', {
        class: `courses__filter-btn ${key === active ? 'courses__filter-btn--active' : ''}`,
        textContent: label,
        'data-filter': key,
        type: 'button'
      })
    )
  })

  return container
}

const animateCoursesTransition = (wrapper, courses, done) => {
  wrapper.classList.add('courses-transition-out')

  setTimeout(() => {
    wrapper.innerHTML = ''

    courses.forEach((course, index) => {
      const slide = el('div', { class: 'swiper-slide' })
      slide.style.setProperty('--slide-index', index)
      slide.append(createCourseCard(course))
      wrapper.appendChild(slide)
    })

    wrapper.classList.remove('courses-transition-out')
    wrapper.classList.add('courses-transition-in')

    setTimeout(() => {
      wrapper.classList.remove('courses-transition-in')
      done?.()
    }, 300)
  }, 300)
}

/* =======================
   MAIN COMPONENT
======================= */

export const createCourses = () => {
  const article = el('article', { class: 'courses', id: 'courses' })

  let swiperCleanup = null
  let currentFilter = 'all'
  let isAnimating = false
  const handlers = new WeakMap()

  const render = (lang) => {
    swiperCleanup?.()
    article.innerHTML = ''

    const content = getCourseContent(lang)
    if (!content?.list?.length) return

    /* header */

    const header = el('section', { class: 'courses__header' })
    header.append(
      el('h2', { class: 'courses__title', textContent: content.title }),
      el('p', { class: 'courses__subtitle', textContent: content.text })
    )

    if (content.filterLabels) {
      const filters = createFilterButtons(content.filterLabels, currentFilter)
      filters.onclick = (e) => handleFilterClick(e, lang)
      header.append(filters)
    }

    /* slider */

    const container = el('div', { class: 'courses__swiper-container' })
    const wrapper = el('div', { class: 'swiper-wrapper' })
    const pagination = el('div', { class: 'swiper-pagination' })
    const prev = el('button', { class: 'swiper-button-prev' })
    const next = el('button', { class: 'swiper-button-next' })

    const filtered = filterCourses(content.list, currentFilter)

    filtered.forEach((course, i) => {
      const slide = el('div', { class: 'swiper-slide' })
      slide.style.setProperty('--slide-index', i)
      slide.append(createCourseCard(course))
      wrapper.appendChild(slide)
    })

    container.append(wrapper, pagination, prev, next)
    article.append(header, container)

    filtered.forEach((course, i) => {
      const btn = wrapper.children[i]?.querySelector('.course-card__button')
      if (btn) handlers.set(btn, createCourseClickHandler(course))
    })

    article.onclick = (e) => {
      const btn = e.target.closest('.course-card__button')
      if (btn && handlers.has(btn)) handlers.get(btn)()
    }

    swiperCleanup = initSwiper(container, next, prev, pagination)
  }

  const handleFilterClick = (e, lang) => {
    const btn = e.target.closest('.courses__filter-btn')
    if (!btn || isAnimating) return

    const filter = btn.dataset.filter
    if (filter === currentFilter) return

    currentFilter = filter
    isAnimating = true

    document.querySelectorAll('.courses__filter-btn')
      .forEach(b => b.classList.toggle(
        'courses__filter-btn--active',
        b.dataset.filter === filter
      ))

    const content = getCourseContent(lang)
    const filtered = filterCourses(content.list, filter)
    const wrapper = article.querySelector('.swiper-wrapper')

    animateCoursesTransition(wrapper, filtered, () => {
      swiperCleanup?.()
      swiperCleanup = initSwiper(
        article.querySelector('.courses__swiper-container'),
        article.querySelector('.swiper-button-next'),
        article.querySelector('.swiper-button-prev'),
        article.querySelector('.swiper-pagination')
      )
      isAnimating = false
    })
  }

  render(getLanguage())
  subscribe(render)

  return article
}
