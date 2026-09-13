/**
 * Theme boot.
 *
 * Inlined into `<head>` so the colour scheme is applied before first paint.
 * Also wires the fallback scroll-reveal observer for browsers without CSS view
 * timelines.
 */
(() => {
  const storageKey = 'semnal-theme';
  const root = document.documentElement;
  const defaultTheme = 'light';
  let storedTheme;

  try {
    storedTheme = localStorage.getItem(storageKey);
  } catch {
    storedTheme = null;
  }

  const updateThemeButtons = (theme) => {
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
      );
    });
  };

  const setTheme = (theme, persist = false) => {
    root.dataset.theme = theme;
    if (persist) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch {}
    }
    updateThemeButtons(theme);
  };

  setTheme(storedTheme || defaultTheme);

  // Scroll reveals run on CSS view timelines where they exist. The observer
  // below is only a fallback, so it is never registered when the browser can do
  // the work itself or the reader asked for less motion.
  const hasViewTimeline = CSS.supports('animation-timeline: view()');
  const canReveal =
    !hasViewTimeline &&
    'IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canReveal) root.classList.add('can-reveal');

  window.addEventListener('DOMContentLoaded', () => {
    updateThemeButtons(root.dataset.theme || defaultTheme);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
      });
    });

    if (!canReveal) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      // Fire as soon as any part of a block enters, reaching 10% past the
      // bottom edge so a section just under the fold has already faded in by
      // the time it is scrolled to. A percentage threshold would hold tall
      // sections back until a large slice was on screen, which reads as content
      // failing to load.
      { threshold: 0, rootMargin: '0px 0px 10% 0px' },
    );

    document
      .querySelectorAll('.reveal, .grid-cards > *')
      .forEach((element) => revealObserver.observe(element));
  });
})();
