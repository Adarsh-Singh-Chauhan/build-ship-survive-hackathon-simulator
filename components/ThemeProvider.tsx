'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

/**
 * Syncs the Zustand theme state with the HTML document's class list.
 * This ensures the dark class is applied on initial page load from persisted state.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useGameStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}
