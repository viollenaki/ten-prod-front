// Utility to scroll to an anchor id on the page.
// It guards against SSR by checking for `document` and will retry once
// after a short timeout to allow client navigation to finish rendering.

export default function scrollToAnchor(id, { offset = 80 } = {}) {
  if (typeof window === 'undefined' || !id) return;

  const tryScroll = () => {
    const el = document.getElementById(id);
    if (!el) return false;
    // compute top offset to account for sticky header
    const rect = el.getBoundingClientRect();
    const absoluteTop = window.pageYOffset + rect.top - offset;
    window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
    return true;
  };

  // If element exists, scroll now
  if (tryScroll()) return;

  // Otherwise retry once after a short delay (useful after router.push)
  requestAnimationFrame(() => {
    setTimeout(() => { tryScroll(); }, 120);
  });
}
