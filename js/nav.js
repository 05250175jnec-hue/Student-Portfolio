// Navigation: mobile menu, active-section highlight, back-to-top button, footer year.
(() => {
  const nav = $('#nav');
  const menuButton = $('#menu');
  const links = [...nav.querySelectorAll('a')];

  function setMenuOpen(open) {
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', open);
  }

  menuButton.onclick = () => setMenuOpen(!nav.classList.contains('open'));
  links.forEach((link) => {
    link.onclick = () => setMenuOpen(false);
  });

  // Highlight the nav link of the section currently in view.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle('on', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  document.querySelectorAll('section').forEach((section) => observer.observe(section));

  // Back-to-top button appears after scrolling down.
  const topButton = $('#top');
  addEventListener(
    'scroll',
    () => topButton.classList.toggle('show', scrollY > 600),
    { passive: true }
  );
  topButton.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

  $('#yr').textContent = new Date().getFullYear();
})();
