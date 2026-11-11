document.querySelectorAll('.service-link').forEach(link => {
  link.addEventListener('click', e => {
    const targets = document.querySelectorAll(link.dataset.target);
    if (!targets.length) return;

    e.preventDefault();

    targets[0].scrollIntoView({ block: 'center' });

    targets.forEach(target => {
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
});