'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollRestorationManager
 * 
 * Ensures that when a user refreshes or opens the website,
 * the page always starts from the very top (0, 0) of the page,
 * preventing the browser from restoring mid-page scroll offsets.
 */
export function ScrollRestorationManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Disable browser's automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Scroll immediately to the top on initial mount
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    // 3. Fallback timers to ensure layout-shifts or late image loads don't push scroll down
    const timer1 = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);

    const timer2 = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 250);

    // 4. On beforeunload, reset scroll so subsequent reload starts at top
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // When route changes, also scroll to top
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pathname]);

  return null;
}
