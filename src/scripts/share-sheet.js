/**
 * Share sheet behaviour: open/close the `<dialog>`, reveal the extra targets
 * and copy the canonical page link. Target URLs are rendered server-side.
 */

const sheet = document.querySelector('[data-share-sheet]');

if (sheet && typeof sheet.showModal === 'function') {
  const openers = document.querySelectorAll('[data-share-open]');
  let lastOpener = null;

  const closeSheet = () => {
    if (sheet.open) sheet.close();
  };

  openers.forEach((opener) => {
    opener.addEventListener('click', () => {
      lastOpener = opener;
      if (!sheet.open) sheet.showModal();
      document.documentElement.classList.add('has-open-share');
    });
  });

  sheet.addEventListener('close', () => {
    document.documentElement.classList.remove('has-open-share');
    lastOpener?.focus({ preventScroll: true });
    lastOpener = null;
  });

  sheet.addEventListener('click', (event) => {
    if (event.target === sheet) closeSheet();
  });

  sheet.querySelectorAll('[data-share-close]').forEach((button) => {
    button.addEventListener('click', closeSheet);
  });

  sheet.querySelectorAll('[data-share-target]').forEach((link) => {
    link.addEventListener('click', closeSheet);
  });

  sheet.querySelector('[data-share-more]')?.addEventListener('click', () => {
    sheet.querySelectorAll('[data-share-extra]').forEach((item) => {
      item.hidden = false;
    });
    const moreItem = sheet.querySelector('[data-share-more-item]');
    if (moreItem) moreItem.hidden = true;
  });

  const copyButton = sheet.querySelector('[data-share-copy]');
  const copyLabel = sheet.querySelector('[data-share-copy-label]');
  const urlField = sheet.querySelector('[data-share-url]');
  /** @type {number | undefined} */
  let resetTimer;

  copyButton?.addEventListener('click', async () => {
    const url = copyButton.getAttribute('data-copy-url');
    if (!url || !copyLabel) return;

    let message = 'Link copied';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(url);
    } catch {
      urlField?.select();
      message = 'Press Ctrl+C to copy';
    }

    copyLabel.textContent = message;
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      copyLabel.textContent = 'Copy link';
    }, 2400);
  });
}
