// Theme toggle and small UX helpers
(function () {
  const toggle = document.getElementById('themeToggle');
  const current = localStorage.getItem('theme');
  if (current) document.documentElement.setAttribute('data-theme', current);

  toggle?.addEventListener('click', () => {
    const now = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', now);
    localStorage.setItem('theme', now);
  });

  // Year in footer
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();


