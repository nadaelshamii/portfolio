/************* tiny helpers *************/
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/************* fade-in on load (respects reduced motion) *************/
(() => {
  const lowMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (!lowMotion) {
    document.body.style.opacity = '0';
    window.addEventListener('DOMContentLoaded', () => {
      document.body.style.transition = 'opacity .4s';
      document.body.style.opacity = '1';
    });
  }
})();

/************* theme toggle (localStorage + system aware) *************/
(() => {
  const html   = document.documentElement;
  const toggle = $('#theme-toggle');
  if (!toggle) return;

  const systemPrefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

  // userChoice: 'light' | 'dark' | null
  const getUserChoice = () => localStorage.getItem('theme');
  const setUserChoice = (val) => (val ? localStorage.setItem('theme', val) : localStorage.removeItem('theme'));

  const computeTheme = () => getUserChoice() || (systemPrefersDark() ? 'dark' : 'light');

  const applyTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    // show opposite icon as the "action" (tap to switch)
    toggle.textContent = theme === 'dark' ? '🌞' : '🌑';
  };

  applyTheme(computeTheme());

  toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setUserChoice(next);
    applyTheme(next);
  });

  // follow system only if user hasn't picked manually
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener('change', (e) => {
    if (!getUserChoice()) applyTheme(e.matches ? 'dark' : 'light');
  });
})();

/************* footer year *************/
(() => {
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();

/************* project filters *************/
(() => {
  const container = $('.filters');
  if (!container) return;

  const cards = $$('.card');
  const setActive = (btn) => {
    $('.filters .active')?.classList.remove('active');
    btn.classList.add('active');
  };

  const showCategory = (cat) => {
    const wantAll = cat === 'all';
    cards.forEach((card) => {
      const cats = (card.dataset.category || '').split(/\s+/).filter(Boolean);
      const match = wantAll || cats.includes(cat);
      card.hidden = !match;
      card.setAttribute('aria-hidden', String(!match));
    });
  };

  // event delegation so it still works if buttons are re-rendered
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-filter]');
    if (!btn) return;
    setActive(btn);
    showCategory(btn.dataset.filter);
  });

  // ensure initial state matches whatever button shipped as .active
  const initial = container.querySelector('button.active') || container.querySelector('button[data-filter]');
  if (initial) showCategory(initial.dataset.filter);
})();

/************* copy email *************/
(() => {
  const btn = $('#email-btn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const email = btn.dataset.email || '';
    try {
      await navigator.clipboard.writeText(email);
      const original = btn.textContent;
      btn.textContent = 'Copied ✔';
      setTimeout(() => (btn.textContent = original), 1500);
    } catch {
      window.prompt('Copy email address:', email);
    }
  });
})();
