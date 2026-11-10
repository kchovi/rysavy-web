document.querySelectorAll('.service-link').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({ block: 'center' });

  
    target.classList.remove('highlight');
    void target.offsetWidth;
    target.classList.add('highlight');

    target.addEventListener(
      'animationend',
      () => target.classList.remove('highlight'),
      { once: true }
    );
  });
});