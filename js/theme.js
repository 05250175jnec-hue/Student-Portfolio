// Light/dark theme toggle. The visitor's choice is remembered in localStorage.
(() => {
  const root = document.documentElement;

  function isDark() {
    const chosen = root.dataset.theme;
    if (chosen) return chosen === 'dark';
    return matchMedia('(prefers-color-scheme: dark)').matches;
  }

  try {
    const saved = localStorage.getItem('theme');
    if (saved) root.dataset.theme = saved;
  } catch (e) {
    // Storage can be blocked; the page still works without it.
  }

  $('#theme').onclick = () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      // Ignore storage errors.
    }
  };
})();
