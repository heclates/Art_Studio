export const setupLazyLoad = (container) => {
  if (!('IntersectionObserver' in window)) {
    container.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
    return null;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const img = entry.target.querySelector('img[data-src]');
        if (img) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '100px' }
  );

  container.querySelectorAll('.teams__card').forEach(card =>
    observer.observe(card)
  );

  return observer;
};

export const setupHoverEffects = (container) => {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = container.querySelectorAll('.teams__card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => {
        if (c !== card) {
          c.classList.add('dimmed');
        }
      });
    });

    card.addEventListener('mouseleave', () => {
      cards.forEach(c => {
        c.classList.remove('dimmed');
      });
    });
  });
};