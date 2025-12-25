export const setupLazyLoad = (wrapper) => {
  if (!('IntersectionObserver' in window)) {
    wrapper.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
    return null;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target.querySelector('img[data-src]');
      if (img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '50px' });

  wrapper.querySelectorAll('.swiper-slide').forEach(slide =>
    observer.observe(slide)
  );

  return observer;
};

export const setupHoverEffects = (wrapper) => {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const slides = wrapper.querySelectorAll('.swiper-slide');

  slides.forEach(slide => {
    slide.addEventListener('mouseenter', () => {
      slides.forEach(s =>
        s === slide
          ? s.classList.add('active-zoom')
          : s.classList.add('blur-slide')
      );
    });

    slide.addEventListener('mouseleave', () => {
      slides.forEach(s =>
        s.classList.remove('active-zoom', 'blur-slide')
      );
    });
  });
};
