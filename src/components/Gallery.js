import Swiper from 'swiper';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { galleryData } from '@/constants/galleryData';
import { createGalleryItem } from './galleryItem';

export const createGallery = () => {
  const article = document.createElement('article');
  article.className = 'gallery';
  article.setAttribute('aria-labelledby', 'gallery-title');

  const h3 = document.createElement('h3');
  h3.id = 'gallery-title';
  h3.className = 'gallery__title';
  h3.textContent = 'Галерея работ';
  article.appendChild(h3);

  const introP = document.createElement('p');
  introP.className = 'gallery__text';
  introP.textContent = 'Творчество наших учеников и атмосфера студии';
  article.appendChild(introP);

  const swiperContainer = document.createElement('div');
  swiperContainer.className = 'gallery-swiper swiper';

  const wrapper = document.createElement('div');
  wrapper.className = 'swiper-wrapper';

  const pagination = document.createElement('div');
  pagination.className = 'swiper-pagination';

  const navPrev = document.createElement('button');
  navPrev.className = 'swiper-button-prev';
  navPrev.type = 'button';
  navPrev.setAttribute('aria-label', 'Предыдущий');

  const navNext = document.createElement('button');
  navNext.className = 'swiper-button-next';
  navNext.type = 'button';
  navNext.setAttribute('aria-label', 'Следующий');

  galleryData.forEach(item => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide gallery__item';
    slide.appendChild(createGalleryItem(item));
    wrapper.appendChild(slide);
  });

  swiperContainer.append(wrapper, pagination, navPrev, navNext);
  article.appendChild(swiperContainer);

  // LAZY LOAD
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target.querySelector('img');
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          observer.unobserve(entry.target);
        }
      }
    });
  });
  wrapper.querySelectorAll('.gallery__item').forEach(item => observer.observe(item));

  // SWIPER ИНИЦИАЛИЗАЦИЯ
  requestAnimationFrame(() => {
    const swiper = new Swiper(swiperContainer, {
      modules: [Navigation, Pagination, A11y],
      slidesPerView: 3,
      spaceBetween: 20,
      loop: false,
      centeredSlides: false,
      grabCursor: true,
      watchOverflow: true,
      navigation: { nextEl: navNext, prevEl: navPrev },
      pagination: { el: pagination, clickable: true },
      a11y: { enabled: true },
      breakpoints: { 320: { slidesPerView: 1 }, 568: { slidesPerView: 2 }, 920: { slidesPerView: 3 } }
    });

    // hover zoom + blur
    wrapper.querySelectorAll('.swiper-slide').forEach(slide => {
      slide.addEventListener('mouseenter', () => {
        wrapper.querySelectorAll('.swiper-slide').forEach(s => {
          s === slide ? s.classList.add('active-zoom') : s.classList.add('blur-slide');
          s !== slide ? s.classList.remove('active-zoom') : s.classList.remove('blur-slide');
        });
      });
      slide.addEventListener('mouseleave', () => {
        wrapper.querySelectorAll('.swiper-slide').forEach(s => s.classList.remove('active-zoom', 'blur-slide'));
      });
    });
  });

  return article;
};
