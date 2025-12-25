// src/utils/galleryUtils.js
export const lazyLoadImages = (container) => {
  const images = container.querySelectorAll('img[loading="lazy"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '100px'
  });

  images.forEach(img => observer.observe(img));
};