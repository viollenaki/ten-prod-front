/**
 * Smooth-scroll to a DOM element by id with a header offset and retry logic.
 *
 * - Safe to call on SSR (it no-ops when window is not available).
 * - Attempts an immediate scroll, and retries once after a short delay
 *   (useful when navigating to a route with a hash and waiting for render).
 *
 * @param {string} id - The element id to scroll to (without #).
 * @param {{offset?: number}} [opts] - Optional settings. offset: header height in px.
 */
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
