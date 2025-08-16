'use client';

import { useState, useEffect } from 'react';

export const useVirtualKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) {
      return;
    }

    const handleResize = () => {
      const viewportHeight = window.innerHeight;
      const visualViewportHeight =
        window.visualViewport?.height || viewportHeight;
      const heightDiff = viewportHeight - visualViewportHeight;
      const isVisible = heightDiff > 100;

      // A positive difference usually means the keyboard is up.
      // We use a threshold to avoid minor fluctuations.
      setKeyboardHeight(isVisible ? heightDiff : 0);
      setIsKeyboardVisible(isVisible);
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

  return { keyboardHeight, isKeyboardVisible };
};
