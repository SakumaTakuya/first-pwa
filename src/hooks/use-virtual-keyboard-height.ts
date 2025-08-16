'use client';

import { useState, useEffect } from 'react';

export const useVirtualKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) {
      return;
    }

    const handleResize = () => {
      const viewportHeight = window.innerHeight;
      const visualViewportHeight = window.visualViewport?.height || viewportHeight;
      const heightDiff = viewportHeight - visualViewportHeight;

      // A positive difference usually means the keyboard is up.
      // We use a threshold to avoid minor fluctuations.
      setKeyboardHeight(heightDiff > 100 ? heightDiff : 0);
    };

    window.visualViewport.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return keyboardHeight;
};
