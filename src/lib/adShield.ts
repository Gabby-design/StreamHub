'use client';

// ============================================================================
// StreamHub Built-in AdShield Engine
// High-performance client-side anti-popup and ad-redirect neutralizer
// Active by default; can be toggled on/off by Master command anytime
// ============================================================================

const STORAGE_KEY = 'streamhub_adshield_active';
const CHANGE_EVENT = 'streamhub:adshield:toggle';

export function isAdShieldActive(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    // Active by default unless explicitly disabled by Master
    return val !== 'false';
  } catch {
    return true;
  }
}

export function setAdShieldActive(active: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, active ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { active } }));
  } catch {
    // ignore
  }
}

export function subscribeToAdShield(callback: (active: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    const custom = e as CustomEvent<{ active: boolean }>;
    callback(custom.detail?.active ?? isAdShieldActive());
  };
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

// Injects anti-clickjacking and popup traps into the host page
export function installAdShieldInterceptors(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Store original window.open
  const originalOpen = window.open;

  // Intercept synthetic or clickjacked window.open calls when AdShield is enabled
  window.open = function (url?: string | URL, target?: string, features?: string): WindowProxy | null {
    if (isAdShieldActive()) {
      const urlStr = String(url || '');
      // Allow internal StreamHub navigation or blank window
      const isInternal =
        urlStr.startsWith('/') ||
        urlStr.includes(window.location.hostname) ||
        urlStr.startsWith('mailto:') ||
        urlStr.startsWith('tel:');

      if (!isInternal && target === '_blank') {
        // Block external popup ad
        return null;
      }
    }
    return originalOpen.call(window, url, target, features);
  };

  // Anti-clickjacking listener to intercept rogue anchor clicks
  const clickHandler = (e: MouseEvent) => {
    if (!isAdShieldActive()) return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Check if clicked element or parent is a rogue external link with target=_blank
    const anchor = target.closest('a') as HTMLAnchorElement | null;
    if (anchor && anchor.target === '_blank' && anchor.href) {
      const href = anchor.href;
      const isExternal = !href.includes(window.location.hostname) && !href.startsWith('/');
      // If clicked inside an embed container or suspect ad element, stop propagation
      if (isExternal && (anchor.closest('.embed-shield') || anchor.hasAttribute('data-ad-trigger'))) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  window.addEventListener('click', clickHandler, true);

  return () => {
    window.open = originalOpen;
    window.removeEventListener('click', clickHandler, true);
  };
}
