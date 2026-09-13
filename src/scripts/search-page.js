/**
 * Full search page: reads `?q=`, ranks the index and renders result cards.
 */

const searchPageForm = document.querySelector('[data-search-page-form]');
const searchPageInput = document.querySelector('[data-search-page-input]');
const searchPageResults = document.querySelector('[data-search-page-results]');
const searchPageSummary = document.querySelector('[data-search-page-summary]');

if (searchPageForm && searchPageInput && searchPageResults && searchPageSummary) {
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

  const renderResults = (posts, query) => {
    if (!query) {
      searchPageSummary.textContent = 'Enter a keyword to search the newsroom.';
      searchPageResults.innerHTML = '';
      return;
    }

    if (query.length < minQueryLength) {
      searchPageSummary.textContent = `Type at least ${minQueryLength} characters to search.`;
      searchPageResults.innerHTML = '';
      return;
    }

    if (!posts.length) {
      searchPageSummary.textContent = `No stories found for "${query}".`;
      searchPageResults.innerHTML = `
          <div class="border border-border bg-card p-6">
            <h2 class="font-display text-2xl font-bold">No matching stories</h2>
            <p class="mt-2 text-muted-foreground">Try a broader topic like quantum, climate, chips, robotics, or biology.</p>
          </div>
        `;
      return;
    }

    searchPageSummary.textContent = `${posts.length} ${posts.length === 1 ? 'story' : 'stories'} found for "${query}".`;
    searchPageResults.innerHTML = posts
      .map(
        (post, index) => `
            <a href="${escapeHtml(post.href)}" class="search-page-result">
              <img
                src="${escapeHtml(post.image.src)}"
                alt="${escapeHtml(post.image.alt)}"
                width="${escapeHtml(post.image.width)}"
                height="${escapeHtml(post.image.height)}"
                loading="${index < 4 ? 'eager' : 'lazy'}"
              />
              <span>
                <span class="site-search-result-category">${escapeHtml(post.category)}</span>
                <h2>${escapeHtml(post.title)}</h2>
                <p>${escapeHtml(post.excerpt)}</p>
                <span class="search-page-result-meta">
                  <span>${escapeHtml(post.dateLabel)}</span>
                  <span aria-hidden="true">/</span>
                  <span>${escapeHtml(post.readMinutes)} min</span>
                  <span aria-hidden="true">/</span>
                  <span>By ${escapeHtml(post.author)}</span>
                </span>
              </span>
            </a>
          `,
      )
      .join('');
  };

  const runSearch = async (query, updateUrl = false) => {
    const trimmedQuery = query.trim();

    if (updateUrl) {
      const url = new URL(window.location.href);
      if (trimmedQuery) {
        url.searchParams.set('q', trimmedQuery);
      } else {
        url.searchParams.delete('q');
      }
      window.history.pushState({}, '', url);
    }

    if (!trimmedQuery || trimmedQuery.length < minQueryLength) {
      renderResults([], trimmedQuery);
      return;
    }

    searchPageSummary.textContent = 'Searching...';
    const posts = await getSearchIndex();
    renderResults(rankPosts(posts, trimmedQuery), trimmedQuery);
  };

  const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
  searchPageInput.value = initialQuery;
  runSearch(initialQuery);

  searchPageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    runSearch(searchPageInput.value, true);
  });

  window.addEventListener('popstate', () => {
    const query = new URLSearchParams(window.location.search).get('q') || '';
    searchPageInput.value = query;
    runSearch(query);
  });
}
