'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export function ThemeLoader() {
  const { settings } = useStore();
  
  useEffect(() => {
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.isDarkMode]);

  return null;
}
