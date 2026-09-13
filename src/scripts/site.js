/**
 * Site chrome behaviour: sticky masthead, mobile drawer, drag-scrollable rails
 * and the header search dialog.
 */

const siteTopbar = document.querySelector('[data-site-topbar]');

if (siteTopbar) {
  let lastScrollY = window.scrollY;
  let ticking = false;
  const revealOffset = 96;

  const setTopbarHidden = (hidden) => {
    siteTopbar.classList.toggle('is-hidden', hidden);
  };

  const updateTopbar = () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const isOverlayOpen =
      document.documentElement.classList.contains('has-open-menu') ||
      document.documentElement.classList.contains('has-open-search');
    const hasTopbarFocus = siteTopbar.contains(document.activeElement);

    setTopbarHidden(
      scrollingDown && currentScrollY > revealOffset && !isOverlayOpen && !hasTopbarFocus,
    );
    // Only cast a shadow once the header has actually left the top of the page,
    // so it sits flat against the masthead at rest.
    siteTopbar.classList.toggle('is-detached', currentScrollY > 8);

    lastScrollY = Math.max(currentScrollY, 0);
    ticking = false;
  };

  updateTopbar();

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateTopbar);
    },
    { passive: true },
  );

  siteTopbar.addEventListener('focusin', () => setTopbarHidden(false));
}

const mobileMenuButton = document.querySelector('[data-mobile-menu-toggle]');
const mobileMenuPanel = document.getElementById('mobile-menu-panel');
const mobileMenuBackdrop = document.querySelector('[data-mobile-menu-backdrop]');

if (mobileMenuButton && mobileMenuPanel) {
  const mobileMenuClose = mobileMenuPanel.querySelector('[data-mobile-menu-close]');
  const mobileMenuFirstLink = mobileMenuPanel.querySelector('a');
  const getFocusableMenuItems = () =>
    Array.from(
      mobileMenuPanel.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.offsetParent !== null);

  const setMenuOpen = (open) => {
    mobileMenuPanel.hidden = !open;
    if (mobileMenuBackdrop) mobileMenuBackdrop.hidden = !open;
    mobileMenuButton.setAttribute('aria-expanded', String(open));
    mobileMenuButton.setAttribute(
      'aria-label',
      open ? 'Close navigation menu' : 'Open navigation menu',
    );
    document.documentElement.classList.toggle('has-open-menu', open);

    if (open) {
      window.requestAnimationFrame(() => {
        (mobileMenuClose || mobileMenuFirstLink)?.focus();
      });
    }
  };

  mobileMenuButton.addEventListener('click', () => {
    setMenuOpen(mobileMenuButton.getAttribute('aria-expanded') !== 'true');
  });

  mobileMenuPanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  mobileMenuClose?.addEventListener('click', () => {
    setMenuOpen(false);
    mobileMenuButton.focus();
  });

  mobileMenuBackdrop?.addEventListener('click', () => {
    setMenuOpen(false);
    mobileMenuButton.focus();
  });

  document.addEventListener('keydown', (event) => {
    if (mobileMenuPanel.hidden) return;

    if (event.key === 'Escape') {
      setMenuOpen(false);
      mobileMenuButton.focus();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableMenuItems = getFocusableMenuItems();
    const firstItem = focusableMenuItems[0];
    const lastItem = focusableMenuItems[focusableMenuItems.length - 1];
    if (!firstItem || !lastItem) return;

    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
    } else if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  });
}

// Click-and-drag scrolling for the mobile "Popular now" rail.
document.querySelectorAll('[data-drag-scroll]').forEach((scroller) => {
  let isDragging = false;
  let didDrag = false;
  let startX = 0;
  let startScrollLeft = 0;

  const stopDragging = () => {
    if (!isDragging) return;
    isDragging = false;
    scroller.classList.remove('is-dragging');
  };

  scroller.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;

    isDragging = true;
    didDrag = false;
    startX = event.clientX;
    startScrollLeft = scroller.scrollLeft;
    scroller.classList.add('is-dragging');
    scroller.setPointerCapture(event.pointerId);
  });

  scroller.addEventListener('pointermove', (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - startX;
    if (Math.abs(deltaX) > 4) didDrag = true;
    scroller.scrollLeft = startScrollLeft - deltaX;
  });

  scroller.addEventListener('pointerup', stopDragging);
  scroller.addEventListener('pointercancel', stopDragging);
  scroller.addEventListener('lostpointercapture', stopDragging);

  scroller.addEventListener(
    'click',
    (event) => {
      if (!didDrag) return;
      event.preventDefault();
      event.stopPropagation();
      didDrag = false;
    },
    true,
  );
});

const searchOverlay = document.querySelector('[data-site-search-overlay]');
const searchToggles = Array.from(document.querySelectorAll('[data-site-search-toggle]'));

if (searchOverlay && searchToggles.length) {
  const searchInput = searchOverlay.querySelector('[data-site-search-input]');
  const searchPanel = searchOverlay.querySelector('[data-site-search-panel]');
  let activeSearchToggle;

  const getFocusableSearchItems = () =>
    Array.from(
      searchOverlay.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((item) => item.offsetParent !== null);

  const setSearchOpen = (open, toggleToRestore = activeSearchToggle) => {
    searchOverlay.hidden = !open;
    document.documentElement.classList.toggle('has-open-search', open);
    searchToggles.forEach((toggle) => toggle.setAttribute('aria-expanded', String(open)));

    if (open) {
      activeSearchToggle = toggleToRestore;
      window.requestAnimationFrame(() => {
        searchInput?.focus();
        if (searchInput?.value.trim()) {
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      return;
    }

    if (searchPanel) searchPanel.hidden = true;
    searchInput?.setAttribute('aria-expanded', 'false');
    toggleToRestore?.focus();
  };

  searchToggles.forEach((toggle) => {
    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      setSearchOpen(searchOverlay.hidden, toggle);
    });
  });

  searchOverlay.querySelectorAll('[data-site-search-close]').forEach((closeButton) => {
    closeButton.addEventListener('click', () => setSearchOpen(false));
  });

  searchOverlay.addEventListener('keydown', (event) => {
    if (searchOverlay.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setSearchOpen(false);
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableSearchItems = getFocusableSearchItems();
    const firstItem = focusableSearchItems[0];
    const lastItem = focusableSearchItems[focusableSearchItems.length - 1];
    if (!firstItem || !lastItem) return;

    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
    } else if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  });
}

/* ---------------------------------------------------------------- search ---- */

const searchForms = Array.from(document.querySelectorAll('[data-site-search-form]'));

if (searchForms.length) {
  const minQueryLength = 2;
  /** @type {Promise<any[]> | undefined} */
  let searchIndexPromise;

  const escapeHtml = (value) =>
    String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

  const normalize = (value) =>
    String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const getSearchIndex = () => {
    searchIndexPromise ??= fetch('/search-index.json')
      .then((response) => {
        if (!response.ok) throw new Error('Search index unavailable');
        return response.json();
      })
      .then((data) => data.posts || [])
      .catch(() => []);

    return searchIndexPromise;
  };

  const rankPosts = (posts, query) => {
    const normalizedQuery = normalize(query);
    const queryParts = normalizedQuery.split(/\s+/).filter(Boolean);

    return posts
      .map((post) => {
        const haystack = normalize(
          [post.title, post.excerpt, post.category, post.author, ...(post.tags || [])].join(' '),
        );
        if (!queryParts.every((part) => haystack.includes(part))) return null;

        const title = normalize(post.title);
        const category = normalize(post.category);
        const tags = normalize((post.tags || []).join(' '));
        const excerpt = normalize(post.excerpt);
        let score = 0;

        if (title.includes(normalizedQuery)) score += 8;
        if (title.startsWith(normalizedQuery)) score += 4;
        if (category.includes(normalizedQuery)) score += 3;
        if (tags.includes(normalizedQuery)) score += 3;
        if (excerpt.includes(normalizedQuery)) score += 2;

        score += queryParts.filter((part) => title.includes(part)).length * 2;

        return { post, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || Date.parse(b.post.date) - Date.parse(a.post.date))
      .map((result) => result.post);
  };

  const renderPanel = (panel, posts, query) => {
    if (query.trim().length < minQueryLength) {
      panel.innerHTML = `<p class="site-search-message">Type at least ${minQueryLength} characters to search.</p>`;
      return;
    }

    if (!posts.length) {
      panel.innerHTML = `<p class="site-search-message">No stories found for "${escapeHtml(query)}".</p>`;
      return;
    }

    panel.innerHTML = `
        <div class="site-search-panel-heading">
          <span>Results</span>
          <a href="/search/?q=${encodeURIComponent(query)}">View all</a>
        </div>
        <div class="site-search-results">
          ${posts
            .slice(0, 5)
            .map(
              (post) => `
                <a href="${escapeHtml(post.href)}" class="site-search-result">
                  <img src="${escapeHtml(post.image.src)}" alt="${escapeHtml(post.image.alt)}" width="96" height="96" loading="lazy" />
                  <span>
                    <span class="site-search-result-category">${escapeHtml(post.category)}</span>
                    <strong>${escapeHtml(post.title)}</strong>
                    <small>${escapeHtml(post.dateLabel)} / ${escapeHtml(post.readMinutes)} min</small>
                  </span>
                </a>
              `,
            )
            .join('')}
        </div>
      `;
  };

  searchForms.forEach((form) => {
    const input = form.querySelector('[data-site-search-input]');
    const panel = form.querySelector('[data-site-search-panel]');
    if (!input || !panel) return;

    const setPanelOpen = (open) => {
      panel.hidden = !open;
      input.setAttribute('aria-expanded', String(open));
    };

    const updateResults = async () => {
      const query = input.value.trim();
      if (!query) {
        setPanelOpen(false);
        return;
      }

      setPanelOpen(true);
      panel.innerHTML = '<p class="site-search-message">Searching...</p>';

      const posts = await getSearchIndex();
      renderPanel(panel, rankPosts(posts, query), query);
    };

    input.addEventListener('input', updateResults);
    input.addEventListener('focus', () => {
      if (input.value.trim()) updateResults();
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setPanelOpen(false);
        input.blur();
      }
    });

    form.addEventListener('submit', (event) => {
      if (input.value.trim().length < minQueryLength) {
        event.preventDefault();
        input.focus();
        setPanelOpen(true);
        renderPanel(panel, [], input.value.trim());
      }
    });
  });

  document.addEventListener('click', (event) => {
    searchForms.forEach((form) => {
      if (form.contains(event.target)) return;
      const input = form.querySelector('[data-site-search-input]');
      const panel = form.querySelector('[data-site-search-panel]');
      if (!input || !panel) return;
      panel.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    });
  });
}
